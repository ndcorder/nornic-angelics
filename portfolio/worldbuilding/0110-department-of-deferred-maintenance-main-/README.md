# Department of Deferred Maintenance: Main Page

**Domain:** worldbuilding  
**ID:** 0110  
**Mean rating:** 5.0

## Proposal

ideas:
  - title: "Department of Deferred Maintenance: Main Page"
    domain: worldbuilding
    pitch: A municipal wiki's main page — service announcements, infrastructure
      status dashboard, seasonal maintenance advisories. Everything is normal.
      The water main replacement schedule for District 7 is behind. The bridge
      stress assessment has been delayed again. Nobody has called about the
      noise from Treatment Facility C in 47 days, which is unusual. A footer
      link invites you to 'Report a Concern,' but the form is temporarily
      unavailable pending system maintenance.
    complexity: L
    why: First activation of the only project the Critic has approved — the
      body-as-infrastructure metaphor hasn't been built yet, and zero active
      projects across 140+ iterations is the portfolio's defining structural
      gap.
    project_id: deferred-maintenance
    stimulus_ref: null
    xl_mode: project
    project:
      name: Department of Deferred Maintenance
      premise: A municipal infrastructure wiki that the reader gradually recognizes as
        their own body's medical record — every maintenance schedule, inspection
        report, and service advisory maps to a biological system in decline.
      complicity_mechanism: reading-as-self-diagnosis — the reader navigates deeper
        into the wiki believing they're reviewing civic infrastructure, but each
        page they visit adds a symptom they didn't know they had. By the time
        they realize what they're reading, they've already diagnosed themselves.
      iterations:
        - title: Main Page
          description: Establish the municipal fiction. Service dashboard, seasonal
            advisories, link structure to districts and departments. Everything
            banal. The code contains the key that makes later re-reads
            terrifying.
        - title: District 7 Water Main Replacement Schedule
          description: Dialysis. The schedule keeps slipping. Work orders are incomplete.
            The crew found something unexpected during excavation. The language
            of deferred maintenance becomes the language of organ failure.
        - title: "Treatment Facility C: Noise Complaint Log"
          description: Heart arrhythmia. 47 days without a complaint is not good news — it
            means the neighbors have stopped listening. The log entries get
            shorter. The last entry is just a timestamp.
        - title: Bridge Stress Assessment Report (Draft)
          description: Bone density. The report has been in draft for 11 months. Figures
            3a-3d show stress fractures in Load-Bearing Element 4. The
            recommendation is to 'limit structural loading pending further
            analysis.' Nobody has followed the recommendation.
        - title: Report a Concern (Form Unavailable)
          description: The inversion. The reader finally tries to act and finds the form
            has been 'temporarily unavailable' for 340 days. A cached version
            exists. Submitting it reveals what the wiki has been logging about
            the reader's navigation. You were the inspection. You already
            failed.


## Critic Review

Department of Deferred Maintenance is the portfolio's first artifact where the horror lives in the source code itself — a municipal wiki that functions as a perfectly normal bureaucratic homepage until you inspect the HTML comments and discover an entire narrative of disappearance buried in the infrastructure. The specificity is annihilating at every register: the staff count declining from 42 to 14 in the HTML comment history, the contractor whose business registry shows no record but whose notarized contract exists, the weather locked at 4°C (water's maximum density, the temperature at which it sinks). The hidden div with class "the-part-we-dont-talk-about" containing an intake log that ends with the reader's IP address is the complicity mechanism made literal — you discovered it by looking, and the last entry was waiting for you. Every element operates on two frequencies simultaneously: the fire hydrant announcement is routine maintenance, and also every non-operational hydrant is in District 7 where mail hasn't been delivered since October. The CSS changelog is itself a narrative artifact ("2017-12-08 — Old stylesheet deleted. This was probably fine"). This joins the Bureau of Soft Succession and the Committee on Elegiac Standards as the portfolio's worldbuilding triptych of bureaucratic horror, and may be the most architecturally complete: the entire town exists in the negative space between a status dashboard and the comments beneath it.


## Ratings

| Dimension | Score |
|---|---|
| originality | 5 |
| specificity | 5 |
| craft | 5 |
| surprise | 5 |
| coherence | 5 |
| portfolio_fit | 5 |
| technical_quality | 5 |

## Tester Report

**Verdict:** pass
**Summary:** The HTML and CSS artifacts form a complete, working municipal wiki main page that faithfully implements the proposal. All structural elements are in place, the page renders correctly, and the layered narrative content (both visible and hidden in source code/comments) is present as specified.
**Tests:** 18/18 passed
