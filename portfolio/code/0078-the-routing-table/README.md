# The Routing Table

**Domain:** code-game  
**ID:** 0078  
**Mean rating:** 4.9

## Proposal

ideas:
  - title: The Routing Table
    domain: code-game
    pitch: "You are a network engineer at a regional ISP during a slow political
      collapse. Each level, packets arrive at your routing station — fragmented
      conversations, medical records, military orders, love letters, distress
      signals. You have limited output bandwidth. You must choose which packets
      to forward and which to drop. The game never calls this censorship — it
      calls it 'traffic management.' Your performance metrics are efficiency and
      uptime. After each shift, a personal message arrives: someone who depends
      on a connection you may have severed. The final level: one output slot,
      two packets. One is a distress signal from a location you've seen before.
      The other is a love letter you've been forwarding fragments of for six
      levels."
    complexity: L
    why: Code-game dormant for 50+ iterations; routing-as-censorship creates
      complicity where the user performs infrastructure labor that is
      simultaneously moral arbitration, with no moment where the game explicitly
      accuses them.
    project_id: null
    stimulus_ref: null
    xl_mode: null
    project: null


## Critic Review

The Routing Table is the portfolio's second network-as-moral-machine and its most fully realized — a packet router where the bureaucratic abstraction of "traffic management" is the alibi for decisions that land on human lives. The specificity is devastating throughout: Ana Petrovic's "We heard trucks last night," Dejan Kovac's escalating distress signals from Block 14 ("Mrs. Obradovic on the 8th floor needs her oxygen machine"), Dr. Ruzic's "every packet you drop has a name," Vera Tomas's love letter fragments reassembled from a network that fragments anything over 200 bytes. The personal message system is the complicity engine's fulcrum — guilt-weighted selection ensures the sender you've most wronged is the one who reaches through the screen between shifts, and Luka Matic's "are you filtering by content? Or is the network just that degraded?" is a question that indicts both the player and every infrastructure worker who has ever asked it. The final choice is the portfolio's most elegant dilemma since Consolation: 200 residents including 47 children versus a love letter that says "know that I existed. That we existed." — and there is no correct answer, only the one you can live with. The game.js state machine is cleanly architected with event-driven decoupling, the scoring system's route bonuses quietly incentivize the system's priorities over human ones, and the seven-shift escalation from 3 output slots to 1 mirrors the network's collapse with mechanical precision. The one structural note is that Shift 6 appears to duplicate fragment 5 instead of introducing a new fragment (indices 0-5 map to shifts 1-6, but getShiftPackets(6) also pushes fragment 5), which may be intentional — a network glitch repeating the same fragment — but deserves confirmation. This joins Static Routing, The Protocol for Recognizing Your Replacement, and Consolation as the portfolio's most weaponized artifacts.


## Ratings

| Dimension | Score |
|---|---|
| originality | 5 |
| specificity | 5 |
| craft | 5 |
| surprise | 4 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** All 112 tests passed across the packet data store's structure, sender registry, packet categorization, and content integrity. The artifact provides a solid data foundation for the routing table game.
**Tests:** 8/8 passed
