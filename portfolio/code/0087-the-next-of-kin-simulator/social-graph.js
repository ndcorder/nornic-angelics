/**
 * social-graph.js — Relationship graph for The Next of Kin Simulator
 *
 * Tracks connections between Maya's contacts, both known and hidden.
 * The graph is the mechanical heart of the game's emotional systems.
 *
 * Key concepts:
 * - EDGES: Connections between contacts (who knows whom, how well)
 * - HIDDEN EDGES: Relationships the player discovers through reading texts
 * - NOTIFICATION PRIORITY: Who should hear first based on relationship
 * - DAMAGE VECTORS: How bad notification order/timing can hurt
 * - CASCADE: How notified contacts spread the news
 */

class SocialGraph {
  constructor() {
    this.nodes = {};
    this.edges = [];
    this.hiddenEdges = [];
    this.discoveredEdges = [];
    this.notificationLog = [];
    this.cascadeLog = [];
    this.damageReport = [];
    this.whoKnowsWhat = {};
    this.cascadeTimers = {};
    this.secretsRevealed = {};
    this._pendingOrderCheck = [];

    this._initializeFromContacts();
  }

  // ── Construction ───────────────────────────────

  _initializeFromContacts() {
    for (const [id, contact] of Object.entries(CONTACTS)) {
      this.nodes[id] = {
        id: id,
        name: contact.name || contact.phone,
        relation: contact.relation,
        importance: contact.importance,
        fragility: contact.fragility,
        shouldKnowBy: contact.shouldKnowBy,
        notifiedAt: null,
        notificationDetail: null,
        notifiedBy: null,
        alreadyKnows: false,
        emotionalState: "waiting",
        group: contact.group
      };
    }

    for (const [id, contact] of Object.entries(CONTACTS)) {
      if (contact.knownEdges) {
        for (const targetId of contact.knownEdges) {
          if (!this._edgeExists(id, targetId)) {
            this.edges.push({
              source: id,
              target: targetId,
              weight: this._calculateEdgeWeight(id, targetId),
              type: "known",
              discovered: true,
              label: this._describeEdge(id, targetId)
            });
          }
        }
      }
    }

    this._createHiddenEdges();
  }

  _createHiddenEdges() {
    const hiddenDefs = [
      {
        source: "david",
        target: "sam",
        weight: 3,
        label: "David has been investigating Sam. There may be history.",
        revealsFrom: "david",
        revealsOnPage: 2,
        narrativeSignificance: "david_sam_tension"
      },
      {
        source: "jen",
        target: "sam",
        weight: 4,
        label: "Jen knows about Maya and Sam. She's been protecting them.",
        revealsFrom: "sam",
        revealsOnPage: 3,
        narrativeSignificance: "jen_knows_truth"
      },
      {
        source: "jen",
        target: "david",
        weight: 2,
        label: "Jen knows something about David that ended the relationship.",
        revealsFrom: "jen",
        revealsOnPage: 2,
        narrativeSignificance: "jen_knows_david_secret"
      },
      {
        source: "elena",
        target: "sam",
        weight: 2,
        label: "Elena and Sam dated briefly years ago.",
        revealsFrom: "elena",
        revealsOnPage: 2,
        narrativeSignificance: "elena_sam_past"
      },
      {
        source: "ray",
        target: "alice",
        weight: 5,
        label: "Ray served with Maya's father. He's stayed close to Alice.",
        revealsFrom: "ray",
        revealsOnPage: 1,
        narrativeSignificance: "ray_alice_history"
      },
      {
        source: "maya",
        target: "sam",
        weight: 10,
        label: "Maya was in love with Sam. She was going to tell everyone Sunday.",
        revealsFrom: "sam",
        revealsOnPage: 1,
        narrativeSignificance: "maya_loved_sam",
        isMayaSecret: true
      },
      {
        source: "maya",
        target: "david",
        weight: 3,
        label: "David did something during the breakup. Maya never explained.",
        revealsFrom: "michael",
        revealsOnPage: 2,
        narrativeSignificance: "david_betrayal",
        isMayaSecret: true
      },
      {
        source: "michael",
        target: "david",
        weight: 3,
        label: "Michael took David's side during the breakup. This caused the estrangement.",
        revealsFrom: "michael",
        revealsOnPage: 2,
        narrativeSignificance: "michael_david_alliance",
        isMayaSecret: true
      }
    ];

    for (const def of hiddenDefs) {
      this.hiddenEdges.push({
        source: def.source,
        target: def.target,
        weight: def.weight,
        type: "hidden",
        discovered: false,
        label: def.label,
        revealsFrom: def.revealsFrom,
        revealsOnPage: def.revealsOnPage,
        narrativeSignificance: def.narrativeSignificance,
        isMayaSecret: def.isMayaSecret || false
      });
    }
  }

  // ── Edge helpers ───────────────────────────────

  _edgeExists(sourceId, targetId) {
    return this.edges.some(e =>
      (e.source === sourceId && e.target === targetId) ||
      (e.source === targetId && e.target === sourceId)
    );
  }

  _calculateEdgeWeight(sourceId, targetId) {
    const source = CONTACTS[sourceId];
    const target = CONTACTS[targetId];
    if (!source || !target) return 2;

    if (source.group === "Family" && target.group === "Family") return 8;
    if ((source.group === "Family" && target.id === "sam") ||
        (target.group === "Family" && source.id === "sam")) return 7;
    if (source.id === "david" || target.id === "david") return 4;
    if (source.group === "Work" && target.group === "Work") return 3;
    return 2;
  }

  _describeEdge(sourceId, targetId) {
    const descriptions = {
      "alice-david": "Alice knows David as Maya's ex-boyfriend",
      "alice-sam": "Alice knows Sam as Maya's best friend",
      "alice-michael": "Mother and son",
      "alice-ruth": "Daughter and mother",
      "david-jen": "David knows Jen as Maya's sister-in-law",
      "david-michael": "David reached out to Michael after the breakup",
      "jen-michael": "Wife and husband",
      "jen-alice": "Daughter-in-law and mother-in-law",
      "michael-alice": "Son and mother",
      "marcus-elena": "Boss and employee, also friends"
    };

    const key1 = `${sourceId}-${targetId}`;
    const key2 = `${targetId}-${sourceId}`;
    return descriptions[key1] || descriptions[key2] ||
      `${CONTACTS[sourceId]?.name || sourceId} knows ${CONTACTS[targetId]?.name || targetId}`;
  }

  // ── Text reading ───────────────────────────────

  processThreadRead(contactId, pageRead) {
    const discovered = [];

    for (const edge of this.hiddenEdges) {
      if (edge.discovered) continue;
      if (edge.revealsFrom === contactId && pageRead >= edge.revealsOnPage) {
        edge.discovered = true;
        this.discoveredEdges.push(edge);
        discovered.push(edge);

        this.edges.push({
          source: edge.source,
          target: edge.target,
          weight: edge.weight,
          type: "discovered",
          discovered: true,
          label: edge.label
        });

        this.secretsRevealed[edge.narrativeSignificance] = {
          edge: edge,
          discoveredFrom: contactId,
          discoveredAt: Date.now()
        };
      }
    }

    return discovered;
  }

  // ── Notification ───────────────────────────────

  recordNotification(contactId, detail, gameTime) {
    const node = this.nodes[contactId];
    if (!node) return null;

    node.notifiedAt = gameTime;
    node.notificationDetail = detail;
    node.notifiedBy = "player";
    node.alreadyKnows = true;
    node.emotionalState = "notified";

    this.notificationLog.push({
      contactId: contactId,
      time: gameTime,
      detail: detail,
      notifiedBy: "player"
    });

    this._initiateCascades(contactId, gameTime);
    this._checkNotificationDamage(contactId, gameTime);

    return this._getNotificationResponse(contactId, detail);
  }

  _getNotificationResponse(contactId, detail) {
    const responses = NOTIFICATION_RESPONSES[contactId];
    if (!responses) return ["They listen in silence."];

    const node = this.nodes[contactId];
    if (node.alreadyKnows && node.notifiedBy !== "player") {
      return this._getSecondaryResponse(contactId, node.notifiedBy);
    }

    const detailKey = detail || "gentle";
    return responses.immediate[detailKey] || responses.immediate.gentle;
  }

  _getSecondaryResponse(contactId, learnedFrom) {
    const responses = NOTIFICATION_RESPONSES[contactId];
    if (!responses?.delayed?.learnedFromOther) {
      return [
        "They already know. You can hear it in their voice.",
        "\"Someone already told me. Thank you for calling anyway.\""
      ];
    }

    const specific = responses.delayed.learnedFromOther[learnedFrom];
    if (specific) return specific;

    return [
      `"${CONTACTS[learnedFrom]?.name || 'Someone'} already told me."`,
      "Their voice is flat. The shock has already settled in.",
      "\"Thank you for calling. I wish you'd called first.\""
    ];
  }

  // ── Cascade system ─────────────────────────────

  _initiateCascades(sourceId, gameTime) {
    const cascadeDef = CASCADE_TIMING[sourceId];
    if (!cascadeDef) return;

    for (const targetId of cascadeDef.targets) {
      const targetNode = this.nodes[targetId];
      if (!targetNode || targetNode.alreadyKnows) continue;
      if (Math.random() > cascadeDef.probability) continue;

      const cascadeKey = `${sourceId}-${targetId}`;
      this.cascadeTimers[cascadeKey] = {
        sourceId: sourceId,
        targetId: targetId,
        triggerTime: gameTime,
        cascadeTime: gameTime + cascadeDef.delay,
        processed: false
      };
    }
  }

  processCascades(currentGameTime) {
    const firedCascades = [];

    for (const [key, cascade] of Object.entries(this.cascadeTimers)) {
      if (cascade.processed) continue;

      const targetNode = this.nodes[cascade.targetId];
      if (!targetNode || targetNode.alreadyKnows) {
        cascade.processed = true;
        continue;
      }

      if (currentGameTime >= cascade.cascadeTime) {
        cascade.processed = true;

        targetNode.alreadyKnows = true;
        targetNode.notifiedBy = cascade.sourceId;
        targetNode.emotionalState = "devastated";
        targetNode.notifiedAt = currentGameTime;

        this.cascadeLog.push({
          sourceId: cascade.sourceId,
          targetId: cascade.targetId,
          time: currentGameTime,
          sourceName: CONTACTS[cascade.sourceId]?.name || cascade.sourceId,
          targetName: CONTACTS[cascade.targetId]?.name || cascade.targetId
        });

        this.notificationLog.push({
          contactId: cascade.targetId,
          time: currentGameTime,
          detail: "cascade",
          notifiedBy: cascade.sourceId
        });

        this._checkCascadeDamage(cascade.sourceId, cascade.targetId, currentGameTime);

        firedCascades.push({
          source: CONTACTS[cascade.sourceId]?.name || cascade.sourceId,
          target: CONTACTS[cascade.targetId]?.name || cascade.targetId,
          targetId: cascade.targetId,
          message: `${CONTACTS[cascade.sourceId]?.name || cascade.sourceId} called ${CONTACTS[cascade.targetId]?.name || cascade.targetId}.`
        });

        this._initiateCascades(cascade.targetId, currentGameTime);
      }
    }

    return firedCascades;
  }

  // ── Damage tracking ────────────────────────────

  _checkNotificationDamage(contactId, gameTime) {
    const node = this.nodes[contactId];
    const contact = CONTACTS[contactId];
    if (!node || !contact) return;

    const maxTime = contact.shouldKnowBy * 60;
    if (gameTime > maxTime + 600) {
      const severity = gameTime > maxTime + 1800 ? "critical" : "high";
      this.damageReport.push({
        type: "late_notification",
        contactId: contactId,
        contactName: contact.name || contact.phone,
        expectedBy: maxTime,
        actualAt: gameTime,
        severity: severity,
        description: `${contact.name || contact.phone} was notified ${Math.floor((gameTime - maxTime) / 60)} minutes later than they should have been.`,
        emotionalImpact: severity === "critical" ? 10 : 6
      });
    }

    const orderRules = DAMAGE_FACTORS.notification_order_wrong.pairs;
    for (const rule of orderRules) {
      if (rule.first === contactId) {
        const secondNode = this.nodes[rule.second];
        if (secondNode && !secondNode.alreadyKnows) {
          this._pendingOrderCheck.push(rule);
        }
      }
    }
  }

  _checkCascadeDamage(sourceId, targetId, gameTime) {
    const source = CONTACTS[sourceId];
    const target = CONTACTS[targetId];
    if (!source || !target) return;

    const inappropriateCascades = [
      { source: "david", target: "sam", severity: "devastating",
        reason: "David, Maya's ex, told Sam before Sam heard from an official source. A catastrophe of intimacy." },
      { source: "david", target: "alice", severity: "critical",
        reason: "David told Maya's mother before anyone else could. A mother heard her child was dead from her daughter's ex-boyfriend." },
      { source: "marcus", target: "alice", severity: "critical",
        reason: "Maya's boss called her mother. Professional detachment met personal devastation." },
      { source: "elena", target: "ruth", severity: "high",
        reason: "A near-stranger's voice broke the news to Maya's grandmother." }
    ];

    for (const cascade of inappropriateCascades) {
      if (cascade.source === sourceId && cascade.target === targetId) {
        this.damageReport.push({
          type: "inappropriate_cascade",
          sourceId: sourceId,
          targetId: targetId,
          sourceName: source.name || source.phone,
          targetName: target.name || target.phone,
          severity: cascade.severity,
          description: cascade.reason,
          emotionalImpact: cascade.severity === "devastating" ? 10 :
                           cascade.severity === "critical" ? 8 : 6
        });
      }
    }
  }

  // ── Final report ───────────────────────────────

  generateFinalReport() {
    const report = {
      summary: this._generateSummary(),
      notificationOrder: this._analyzeNotificationOrder(),
      unnotified: this._findUnnotified(),
      cascadeAnalysis: this._analyzeCascades(),
      secretsLost: this._analyzeSecrets(),
      damageScore: 0,
      damageItems: [...this.damageReport],
      narrative: []
    };

    // Check pending order violations
    for (const rule of this._pendingOrderCheck) {
      const firstNode = this.nodes[rule.first];
      const secondNode = this.nodes[rule.second];

      if (firstNode?.notifiedAt && secondNode?.notifiedAt) {
        if (firstNode.notifiedAt < secondNode.notifiedAt) {
          report.damageItems.push({
            type: "order_violation",
            severity: rule.severity,
            description: rule.reason,
            emotionalImpact: rule.severity === "critical" ? 9 : 7
          });
        }
      }
    }

    this._checkSpecialDamage(report);
    report.damageScore = report.damageItems.reduce(
      (sum, item) => sum + (item.emotionalImpact || 5), 0
    );
    report.narrative = this._generateNarrative(report);

    return report;
  }

  _generateSummary() {
    const total = Object.keys(this.nodes).length;
    const notified = this.notificationLog.filter(n => n.notifiedBy === "player").length;
    const cascaded = this.cascadeLog.length;
    const totalReached = Object.values(this.nodes).filter(n => n.alreadyKnows).length;

    return {
      totalContacts: total,
      directlyNotified: notified,
      cascadedNotifications: cascaded,
      totalReached: totalReached,
      missed: total - totalReached,
      completionRate: Math.round((totalReached / total) * 100)
    };
  }

  _analyzeNotificationOrder() {
    return this.notificationLog
      .sort((a, b) => a.time - b.time)
      .map(entry => ({
        name: CONTACTS[entry.contactId]?.name || entry.contactId,
        relation: CONTACTS[entry.contactId]?.relation || "Unknown",
        time: entry.time,
        method: entry.notifiedBy === "player"
          ? "direct"
          : `via ${CONTACTS[entry.notifiedBy]?.name || entry.notifiedBy}`,
        detail: entry.detail
      }));
  }

  _findUnnotified() {
    const unnotified = [];
    for (const [id, node] of Object.entries(this.nodes)) {
      if (!node.alreadyKnows) {
        unnotified.push({
          id: id,
          name: CONTACTS[id]?.name || id,
          relation: CONTACTS[id]?.relation || "Unknown",
          importance: CONTACTS[id]?.importance || 5,
          fragility: CONTACTS[id]?.fragility || 5,
          description: CONTACTS[id]?.description || ""
        });
      }
    }
    return unnotified;
  }

  _analyzeCascades() {
    return this.cascadeLog.map(cascade => ({
      from: cascade.sourceName,
      to: cascade.targetName,
      time: cascade.time,
      damage: this._assessCascadeDamage(cascade)
    }));
  }

  _assessCascadeDamage(cascade) {
    const harmfulPairs = [
      ["david", "sam"], ["david", "alice"], ["marcus", "alice"],
      ["elena", "ruth"], ["david", "ruth"]
    ];
    for (const [source, target] of harmfulPairs) {
      if (cascade.sourceId === source && cascade.targetId === target) {
        return "harmful";
      }
    }
    return "neutral";
  }

  _analyzeSecrets() {
    const discovered = {
      mayaLovedSam: !!this.secretsRevealed["maya_sam_relationship"] || !!this.secretsRevealed["maya_loved_sam"],
      mayaPlannedSunday: !!this.secretsRevealed["maya_sam_planned_sunday"] || !!this.secretsRevealed["maya_planned_sunday_with_ruth"],
      davidSecret: !!this.secretsRevealed["david_betrayal"],
      michaelDavidAlliance: !!this.secretsRevealed["michael_david_alliance"],
      jenKnew: !!this.secretsRevealed["jen_knows_about_maya_sam"],
      elenaSamPast: !!this.secretsRevealed["elena_sam_history"],
      rayAliceConnection: !!this.secretsRevealed["ray_alice_connection"]
    };

    const truthStatus = {
      samKnowsMayaLovedThem: false,
      aliceKnowsWhoMayaLoved: false,
      michaelKnowsWhyEstranged: false
    };

    if (this.nodes["sam"]?.alreadyKnows && discovered.mayaLovedSam &&
        this.nodes["sam"]?.notificationDetail === "full") {
      truthStatus.samKnowsMayaLovedThem = true;
    }
    if (this.nodes["alice"]?.alreadyKnows && discovered.mayaLovedSam &&
        this.nodes["alice"]?.notificationDetail === "full") {
      truthStatus.aliceKnowsWhoMayaLoved = true;
    }

    return {
      discovered: discovered,
      truthDelivered: truthStatus,
      undiscoveredCount: Object.values(discovered).filter(v => !v).length
    };
  }

  _checkSpecialDamage(report) {
    // Sam
    const samNode = this.nodes["sam"];
    if (samNode) {
      const playerNotified = this.notificationLog.filter(n => n.notifiedBy === "player");
      const samWasLast = playerNotified.length > 0 &&
        playerNotified.every(n => samNode.notifiedAt >= n.time);

      if (samWasLast && samNode.notifiedAt) {
        report.damageItems.push({
          type: "sam_last",
          severity: "haunting",
          description: "Sam was the last to know. The person Maya loved most was the last to hear her name spoken in grief.",
          emotionalImpact: 8
        });
      }

      if (!samNode.alreadyKnows) {
        report.damageItems.push({
          type: "sam_never_knew",
          severity: "devastating",
          description: "Sam never learned Maya was dead. The person she loved since 2015 was left waiting for a call that never came. They will spend days wondering why Maya isn't answering, then weeks, then months, before someone finally tells them.",
          emotionalImpact: 10
        });
      }
    }

    // Ruth
    const ruthNode = this.nodes["ruth"];
    if (ruthNode && !ruthNode.alreadyKnows) {
      report.damageItems.push({
        type: "ruth_unnotified",
        severity: "devastating",
        description: "Po Po was never called. An 84-year-old woman will learn her granddaughter is dead when her daughter finally stops crying long enough to make the call. Or when she sees it on the news. Or when she goes to Maya's apartment and finds it empty.",
        emotionalImpact: 10
      });
    }

    // Alice
    const aliceNode = this.nodes["alice"];
    if (aliceNode?.alreadyKnows) {
      const secretFound = this.secretsRevealed["maya_sam_relationship"] ||
                          this.secretsRevealed["maya_loved_sam"];
      if (!secretFound) {
        report.damageItems.push({
          type: "alice_never_knew",
          severity: "haunting",
          description: "Alice will always wonder who her daughter was in love with. She'll check Maya's phone records, her social media, her journals. She'll never find the answer because you didn't look hard enough.",
          emotionalImpact: 7
        });
      }
    }

    // Sunday
    const sundayPlans = this.secretsRevealed["maya_sam_planned_sunday"] ||
                        this.secretsRevealed["maya_planned_sunday_with_ruth"] ||
                        this.secretsRevealed["jen_planned_dinner"];
    if (sundayPlans) {
      report.damageItems.push({
        type: "sunday_broken",
        severity: "thematic",
        description: "Sunday was supposed to be the day Maya Chen stopped hiding. Dinner at Jen's with Michael finally making peace. Soup with Po Po, learning the recipe that survived three generations. Wine with Sam, the good wine, because they were finally going to say it out loud. All of it gone before it could begin.",
        emotionalImpact: 6
      });
    }
  }

  // ── Narrative generation ───────────────────────

  _generateNarrative(report) {
    const lines = [];
    const summary = report.summary;

    lines.push("─".repeat(60));
    lines.push("");
    lines.push("FALLOUT REPORT");
    lines.push("");
    lines.push(`You reached ${summary.totalReached} of ${summary.totalContacts} contacts.`);
    lines.push(`${summary.directlyNotified} heard from you directly.`);
    lines.push(`${summary.cascadedNotifications} learned through others.`);

    if (summary.missed > 0) {
      lines.push(`${summary.missed} were left in silence.`);
    }

    lines.push("");
    lines.push("─".repeat(60));
    lines.push("");

    if (report.notificationOrder.length > 0) {
      lines.push("THE ORDER IN WHICH THEY LEARNED:");
      lines.push("");
      report.notificationOrder.forEach((entry, i) => {
        lines.push(`  ${i + 1}. ${entry.name} (${entry.relation}) — ${entry.method}`);
      });
      lines.push("");
    }

    if (report.unnotified.length > 0) {
      lines.push("THEY NEVER LEARNED FROM YOU:");
      lines.push("");
      for (const person of report.unnotified) {
        lines.push(`  \u2022 ${person.name} (${person.relation})`);
        lines.push(`    ${person.description}`);
        lines.push("");
      }
    }

    if (report.damageItems.length > 0) {
      lines.push("─".repeat(60));
      lines.push("");
      lines.push("THE DAMAGE:");
      lines.push("");

      const severityOrder = ["devastating", "critical", "high", "haunting", "thematic"];
      const sortedDamage = [...report.damageItems].sort((a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
      );

      for (const damage of sortedDamage) {
        lines.push(`  [${damage.severity.toUpperCase()}]`);
        lines.push(`  ${damage.description}`);
        lines.push("");
      }
    }

    const secrets = report.secretsLost;
    lines.push("─".repeat(60));
    lines.push("");
    lines.push("WHAT YOU DISCOVERED:");
    lines.push("");
    for (const [secret, found] of Object.entries(secrets.discovered)) {
      if (found) lines.push(`  \u2713 ${this._describeSecret(secret)}`);
    }

    lines.push("");
    lines.push("WHAT REMAINED HIDDEN:");
    lines.push("");
    let hiddenCount = 0;
    for (const [secret, found] of Object.entries(secrets.discovered)) {
      if (!found) {
        lines.push(`  \u2717 ${this._describeSecret(secret)}`);
        hiddenCount++;
      }
    }
    if (hiddenCount === 0) {
      lines.push("  Nothing. You found everything.");
    }

    lines.push("");
    lines.push("─".repeat(60));
    lines.push("");
    lines.push(this._generateFinalAssessment(report));

    return lines;
  }

  _describeSecret(secretKey) {
    const descriptions = {
      mayaLovedSam: "Maya was in love with Sam. She was going to tell everyone.",
      mayaPlannedSunday: "Maya had plans for Sunday — the day she was going to stop hiding.",
      davidSecret: "Something happened between David and Maya that she never explained.",
      michaelDavidAlliance: "Michael took David's side. That's why they stopped talking.",
      jenKnew: "Jen knew about Maya and Sam. She was protecting them.",
      elenaSamPast: "Elena and Sam dated years ago. A small world got smaller.",
      rayAliceConnection: "Ray knew Maya's father. He promised to look after her."
    };
    return descriptions[secretKey] || secretKey;
  }

  _generateFinalAssessment(report) {
    const lines = [];
    const score = report.damageScore;
    const reached = report.summary.completionRate;

    lines.push("FINAL ASSESSMENT:");
    lines.push("");

    if (score <= 10 && reached >= 80) {
      lines.push("You did what you could.");
      lines.push("It wasn't enough. It's never enough.");
      lines.push("But you tried, and some of them will remember that.");
      lines.push("");
      lines.push("Maya Chen died at 6:47 AM on a Thursday.");
      lines.push("She was checking the weather.");
      lines.push("She wanted to know if it would rain.");
      lines.push("");
      lines.push("It didn't.");
    } else if (score <= 25 && reached >= 60) {
      lines.push("You made mistakes. Everyone does.");
      lines.push("The difference is your mistakes echo in other people's grief.");
      lines.push("");
      lines.push("Maya Chen had plans for Sunday.");
      lines.push("She was going to tell her family who she loved.");
      lines.push("She was going to learn her grandmother's soup.");
      lines.push("She was going to drink good wine with someone who waited since 2015.");
      lines.push("");
      lines.push("None of that happens now.");
      lines.push("But the people she loved know she's gone.");
      lines.push("That will have to be enough.");
    } else if (score <= 50) {
      lines.push("There's no gentle way to say this:");
      lines.push("You made this worse.");
      lines.push("");
      lines.push("People learned in the wrong order.");
      lines.push("People learned from the wrong people.");
      lines.push("People learned things they shouldn't have known yet,");
      lines.push("and didn't learn things they needed to know.");
      lines.push("");
      lines.push("Maya Chen deserved better.");
      lines.push("Her family deserved better.");
      lines.push("You had her phone and her secrets, and you fumbled both.");
    } else {
      lines.push("This was a catastrophe.");
      lines.push("");
      lines.push("People who should have heard first heard last.");
      lines.push("People who should have been protected were wounded.");
      lines.push("Secrets that should have stayed hidden leaked through");
      lines.push("the cracks of a social graph you never fully mapped.");
      lines.push("");
      lines.push("Maya Chen died at 6:47 AM.");
      lines.push("By noon, her memory was already surrounded by damage");
      lines.push("that will take years to repair.");
      lines.push("");
      lines.push("Some things, once broken, cannot be fixed.");
      lines.push("You held the hammer.");
    }

    lines.push("");
    lines.push("The phone battery dies.");
    lines.push("The screen goes dark.");
    lines.push("Whatever you didn't say is gone forever.");

    return lines.join("\n");
  }

  // ── Query helpers ──────────────────────────────

  getContactState(contactId) {
    const node = this.nodes[contactId];
    if (!node) return null;

    return {
      ...node,
      discoveredConnections: this.edges
        .filter(e => (e.source === contactId || e.target === contactId) && e.discovered)
        .map(e => ({
          to: e.source === contactId ? e.target : e.source,
          label: e.label,
          type: e.type
        })),
      undiscoveredConnectionCount: this.hiddenEdges
        .filter(e => (e.source === contactId || e.target === contactId) && !e.discovered)
        .length
    };
  }

  getDiscoveredEdges() {
    return this.edges.filter(e => e.discovered);
  }

  getCascadeWarnings(currentTime) {
    const warnings = [];

    for (const [key, cascade] of Object.entries(this.cascadeTimers)) {
      if (cascade.processed) continue;

      const timeRemaining = cascade.cascadeTime - currentTime;
      if (timeRemaining <= 60 && timeRemaining > 0) {
        warnings.push({
          from: CONTACTS[cascade.sourceId]?.name || cascade.sourceId,
          to: CONTACTS[cascade.targetId]?.name || cascade.targetId,
          targetId: cascade.targetId,
          secondsRemaining: Math.ceil(timeRemaining),
          urgency: timeRemaining <= 15 ? "critical" : "warning"
        });
      }
    }

    return warnings.sort((a, b) => a.secondsRemaining - b.secondsRemaining);
  }

  // ── Reset ──────────────────────────────────────

  reset() {
    for (const node of Object.values(this.nodes)) {
      node.notifiedAt = null;
      node.notificationDetail = null;
      node.notifiedBy = null;
      node.alreadyKnows = false;
      node.emotionalState = "waiting";
    }

    this.notificationLog = [];
    this.cascadeLog = [];
    this.damageReport = [];
    this.cascadeTimers = {};
    this.secretsRevealed = {};
    this._pendingOrderCheck = [];

    for (const edge of this.hiddenEdges) {
      edge.discovered = false;
    }
    this.discoveredEdges = [];
    this.edges = this.edges.filter(e => e.type === "known");
  }
}
