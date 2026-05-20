/**
 * NARRATIVE.js
 *
 * Pre-authored file contents for the Washington State Board of Veterinary Medicine
 * Automated Credentialing Server (creden-vet.wa.gov)
 */

const NARRATIVE = {};

// ============================================
// /etc/motd - Message of the Day
// ============================================
NARRATIVE.motd = `Welcome to creden-vet.wa.gov
Washington State Board of Veterinary Medicine
Automated Credentialing & License Renewal System v3.4.1

Last audited: 2024-02-15

NOTICE: All sessions are logged per RCW 42.56.

Active licensed veterinarians: 4,217
Pending reviews: 3
System uptime: 312 days, 14:22:07`;

// ============================================
// /root/README.txt - Your contract
// ============================================
NARRATIVE.rootReadme = `                    DECOMMISSIONING WORK ORDER
              WA State DPO Contract #2024-0871-VC

SERVER:       creden-vet.wa.gov
PURPOSE:      Automated veterinary credential verification
              and license renewal processing
LOCATION:     Olympic Data Center, Tacoma WA, Rack 14-C

CONTRACTOR:   [ your name here ]
AUTHORIZED:   2024-07-02
DEADLINE:     2024-07-15 23:59:59 PST

SCOPE OF WORK:
1. Verify all active processes and scheduled tasks have been
   documented and transferred to the replacement system at
   creden-vet2.wa.gov
2. Export and archive all license databases per retention
   schedule (RCW 40.14)
3. Confirm no pending credential reviews remain open
4. Terminate all cron jobs and automated processing
5. Issue shutdown command

SPECIAL INSTRUCTIONS FROM AGENCY:
  "The server has been running unattended since March. Former
  administrator (Dr. Elaine Voss, DVM) is no longer with the
  agency. Access credentials were provided separately. Please
  ensure the pending reviews database is fully archived before
  decommission. We cannot lose those records.

  The families have been patient."

                                        - Gerald T. Mora
                                          IT Director, WA Dept. of Licensing
                                          g.mora@dol.wa.gov`;

// ============================================
// /root/audit_notes.txt
// ============================================
NARRATIVE.auditNotes = `AUDIT NOTES - Feb 15, 2024
Auditor: Elaine Voss
Scope: Annual credentialing system review

- System healthy. Renewal pipeline working as designed.
- Backups on schedule.
- Three pending reviews from Q4 2023 still in queue.
  These need manual sign-off. I'll do them next week.

- Need to update phone number for Dr. Ortega's clinic.
  He moved practices last month.
- Dr. Pham's license renewal auto-approved again. We should
  really check if her continuing ed credits are real this time.
  She swears they are but the certificates look like they were
  printed at home.

- I keep getting locked out of the pending reviews DB.
  The permissions keep reverting. I think there's a cron job
  doing it but I can't find it. I'll ask Niles to look.

- E.`;

// ============================================
// /etc/passwd entries
// ============================================
NARRATIVE.passwd = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false
postfix:x:112:118::/var/spool/postfix:/usr/sbin/nologin
evoss:x:1000:1000:Elaine Voss,,,:/home/evoss:/bin/bash
nmarks:x:1001:1001:Niles Marks,,,:/home/nmarks:/bin/bash
rcurtis:x:1002:1002:Rachel Curtis,,,:/home/rcurtis:/bin/bash
credentd:x:2000:2000:Credentialing Daemon:/opt/credent:/usr/sbin/nologin
backupsvc:x:2001:2001:Backup Service:/var/backup:/usr/sbin/nologin
auditlog:x:2002:2002:Audit Logger:/var/log/audit:/usr/sbin/nologin`;

// ============================================
// /home/evoss/.bash_history
// ============================================
NARRATIVE.evossHistory = `cd /opt/credent
ls -la
cat config/main.yml
vim config/main.yml
systemctl restart credentd
tail -f /var/log/credent/renewals.log
cd /var/cred
ls
ls archive/2024/
ls -la archive/2024/pending_reviews.db
chmod 660 archive/2024/pending_reviews.db
chown evoss:credentd archive/2024/pending_reviews.db
ls -la archive/2024/pending_reviews.db
cd /opt/credent
vim config/main.yml
systemctl restart credentd
sleep 10
ls -la /var/cred/archive/2024/pending_reviews.db
# what the hell is resetting the permissions
crontab -l
ls /etc/cron.d/
cat /etc/cron.d/credent-cleanup
# nothing in there
find /etc/cron* -type f -exec grep lock {} \\;
# nothing
ps aux | grep lock
# nothing running
vim /home/evoss/notes/permissions_problem.txt
cd /home/evoss/notes/
vim todays_work.txt
cd /home/evoss
mutt
exit`;

// ============================================
// /home/evoss/notes/permissions_problem.txt
// ============================================
NARRATIVE.permissionsProblem = `PERMISSIONS PROBLEM - Ongoing

/var/cred/archive/2024/pending_reviews.db

Mode keeps reverting to 0000 (no access for anyone).
Even root gets Permission denied.

Found a script: /opt/credent/scripts/lock_reviews.py
- Sets mode to 0000
- Runs as root (how?)
- Not in any crontab I can find
- Not in systemd timers
- No process running it

I've tried:
- chmod (reverts within 60 seconds)
- chattr +i (doesn't stick)
- Removing the script (permission denied as root??)
- Strace on the file (nothing useful)

Niles - please look at this. You built the original
system, maybe there's something I'm not seeing.

These reviews have been pending since October. The
veterinarians are waiting. Dr. Ortega's new practice
needs his updated license. Dr. Pham's insurance won't
renew without it. Dr. Yoon's specialty certification
is on hold.

- Elaine`;

// ============================================
// /home/evoss/notes/todays_work.txt
// ============================================
NARRATIVE.todaysWork = `TODO - Feb 26, 2024

[ ] Fix the permissions issue on pending_reviews.db
[ ] Process Dr. Ortega's renewal (has been waiting since Oct)
[ ] Process Dr. Pham's renewal (CE credits look OK now)
[ ] Process Dr. Yoon's renewal (expedited, military waiver)
[ ] Update phone number for Dr. Ortega's new clinic
[ ] Call Gerald at DOL about decommission timeline
[ ] Email Niles about the lock_reviews.py script
[ ] Check backups
[ ] Review Dr. Ortega's complaint file

REMINDERS:
- Gerald says the new server is almost ready
- Need everything off this machine by end of March
- Niles is leaving the agency in April, want him to
  document everything first
- Rachel can handle day-to-day after I'm done

- E.`;

// ============================================
// /home/nmarks/.bash_history
// ============================================
NARRATIVE.nmarksHistory = `cd /opt/credent
ls -la scripts/
cat scripts/lock_reviews.py
# she found it
# i need to explain this to her
# but i can't tell her why i wrote it
cd /var/cred/archive/2024/
ls -la
stat pending_reviews.db
# permissions still reverting. good.
# that's the point
vim /home/nmarks/private/journal.txt
cd /home/nmarks
mutt -s "Re: pending reviews" e.voss@wa.gov
# told her i'd look into it
vim /home/nmarks/private/journal.txt
exit`;

// ============================================
// /home/nmarks/private/journal.txt
// ============================================
NARRATIVE.nmarksJournal = `PRIVATE - NILES MARKS

---
October 3, 2023

Dr. Hayes cornered me at the conference in Spokane. The
small animal conference. He said he knew about the shortcuts
I took on the credentialing system when I built it. Said the
renewal pipeline didn't do proper background checks. Said I'd
enabled unlicensed practice.

He was right. I was under deadline. The old system was
failing. I cut corners. I made it so renewals auto-approved
if the license was in good standing. No re-verification.
No background re-check. No CE audit.

He said he was going to report me. To the board. To the
state. To everyone.

I told him I'd fix it quietly. I told him I'd add the
checks back. I told him I'd run a retroactive audit.
He gave me thirty days.

---
October 15, 2023

I haven't fixed anything. I don't know how to without
admitting what I did. The retroactive audit would show
that dozens of vets were renewed without proper verification.
Some of them had complaints. Some had disciplinary actions
in other states.

Dr. Hayes is getting impatient. He's calling my office.
He's emailing. I'm avoiding him.

---
October 23, 2023

I added the lock script.

I set pending_reviews.db to 0000 permissions and wrote a
script that would keep resetting them. I hid the script
in with the legitimate ones. I set it to run via a mechanism
Elaine wouldn't think to check.

The reviews in that database would show that I flagged three
veterinarians for manual review. Three who squeaked through
my broken pipeline. Three who had complaints against them.

If those reviews are processed, someone will look into why
they were flagged. And they'll find my shortcuts.

---
October 29, 2023

Dr. Ortega called today. His license renewal is pending.
He just moved to a new practice. His patients need him.

His complaint was minor. A billing dispute with a client.
It was dismissed. He should be fine.

But I can't open that database.

---
November 8, 2023

Dr. Yoon called. Veterinary pathologist. Military. She needs
her specialty certification renewed for her contract with
Joint Base Lewis-McChord. No complaints. No issues. Should
have been approved automatically but got flagged because of
the military waiver process.

She was so polite. She said her CO was willing to wait.

I told her I'd expedite it.

---
November 15, 2023

I'm a coward.

---
December 2023 - January 2024

[ no entries ]

---
February 20, 2024

Elaine found the lock script. She's been trying to get
into pending_reviews.db for weeks. She's documented
everything. She's meticulous. She's better at this job
than I ever was.

She's going to figure it out.

---
February 26, 2024

Elaine left a note about the permissions problem. She
wants me to look at it. She's cc'd Gerald at DOL.

I have to do something.

I could blame it on a system error. A bug in the
credentialing daemon. I could say the permissions got
corrupted and I'll restore from backup.

But the backup would show the same flags.

I'm going to tell Elaine. Tomorrow. Everything.

Tomorrow.

---
February 27, 2024

[ no entry ]

---
February 28, 2024

Elaine is dead.

---
February 29, 2024

Car accident on I-5. Single vehicle. They said she
lost control in the rain.

---
March 3, 2024

Rachel called me. She said Elaine's car was in perfect
condition. She said the police report didn't make sense.

I told her to let it go. I told her accidents happen.

Rachel said that was a strange thing to say.

---
March 8, 2024

Rachel is dead.

They're saying it was a home invasion. Nothing was taken.

---
March 14, 2024

Dr. Ortega is dead. Car went off the road near Snoqualmie
Pass. They're saying ice.

---
March 18, 2024

Dr. Pham is dead. Anaphylaxis. Bee sting. She was allergic.
She always carried an EpiPen. They didn't find one at
the scene.

---
March 22, 2024

Dr. Yoon is dead. Collapsed during a training exercise
at JBLM. Cardiac event. She was 34. She ran marathons.

---
March 23, 2024

Four people are dead.

Elaine, who was going to fix my mistakes.
Rachel, who was going to find out why Elaine died.
Dr. Ortega, who just wanted to practice medicine.
Dr. Pham, who probably faked her CE credits and
  didn't deserve to die for it.
Dr. Yoon, who served this country and trusted me
  to do my job.

Someone is killing these people. Someone who knows
about the credentialing failures. Someone who knows
what I hid. Someone who is cleaning up my mess.

Or maybe it's coincidence. Maybe I'm paranoid.

But Rachel?

Rachel who called me? Who said the police report
didn't make sense? Who lived in a gated community
with security cameras that conveniently malfunctioned
that night?

---
March 25, 2024

I know who it is. I've known since Rachel.

Gerald was the only other person who knew about the
system. He approved the original design. He signed
off on the timeline that made me cut corners. He
looked the other way when I told him the background
checks would be "phased in."

And he's the one who's having the server decommissioned.

I'm leaving this journal where someone will find it.

If you're reading this, I'm probably dead too.

The pending_reviews.db file is locked because I locked
it. The reviews inside would have shown that three
veterinarians were flagged and never processed. Those
three veterinarians are now dead. The two people who
might have discovered what I did are also dead.

My name is Niles Marks. I built the credentialing
system for the Washington State Board of Veterinary
Medicine. I cut corners. I endangered the public. I
covered it up. And people died.

- N.M.`;

// ============================================
// /home/rcurtis/.bash_history
// ============================================
NARRATIVE.rcurtisHistory = `cd /home/rcurtis
ls
cd /var/cred
ls
ls archive/2024/
ls -la archive/2024/
cat /home/evoss/notes/permissions_problem.txt
# elaine was right. this is wrong
cd /opt/credent/scripts/
cat lock_reviews.py
# who wrote this? not in git log
git log scripts/lock_reviews.py
# empty. someone wiped the history
git reflog
# empty too
cd /var/log
sudo cat auth.log.1 | grep nmarks
sudo cat auth.log.1 | grep root
# niles logged in as root on feb 26
# same day elaine asked him about the permissions
cd /home/nmarks
ls -la private/
sudo cat private/journal.txt
# permission denied?? with sudo?
ls -la private/journal.txt
# mode 0000. same trick as pending_reviews.db
sudo lsattr private/journal.txt
# ----i---------e-- immutable. he used chattr.
cd /var/log
sudo grep root auth.log | tail -50
# someone logging in as root from 10.0.0.1
# that's the management interface
# who else has access to that?
cd /home/rcurtis
vim investigation_notes.txt
mutt -s "Something wrong with the server" g.mora@dol.wa.gov
exit`;

// ============================================
// /home/rcurtis/investigation_notes.txt
// ============================================
NARRATIVE.investigationNotes = `NOTES - March 3, 2024

Things that don't add up:

1. Elaine's car. She drove that Subaru for six years.
   She was meticulous about maintenance. Her tires were
   two months old. The police report says she was going 70
   in a 60 zone. Elaine never speeded.

2. The permissions problem. Someone wrote a script to lock
   a database. The database contains routine license reviews.
   Why would anyone lock routine reviews?

3. Niles. He built this system. He knows every inch of it.
   He could hide something here if he wanted to. And he's
   not returning my calls.

4. The git history is gone. Someone wiped it. That takes
   effort. That takes intent.

5. Root logins from 10.0.0.1. Management interface.
   Niles has access. But so does someone at DOL.

---
March 7, 2024

Niles called. He sounded terrible. Like he hadn't slept.
He told me to drop it. To leave the server alone. To
forget about the permissions problem.

I asked him why.

He hung up.

---
March 8, 2024 - 11:47 PM

Someone is in my house.

I called 911. The line went dead.

I'm in the closet. Door locked. Dresser against it.

Check root logins from 10.0.0.1. Check Feb 27 and 28.
Check who was logged in when Elaine died.

I don't think I'm getting out of this.

- R.`;

// ============================================
// /opt/credent/config/main.yml
// ============================================
NARRATIVE.credentConfig = `# Credentialing System Configuration
# WA State Board of Veterinary Medicine
# Last modified: 2023-09-15 by nmarks

system:
  name: "VetCred WA"
  version: "3.4.1"
  environment: production

database:
  host: localhost
  port: 5432
  name: vetcred
  user: credentd
  password_file: /opt/credent/.dbpass

renewal:
  auto_approve: true
  # Changed from false on 2023-06-15 by nmarks
  # NOTE FROM EVOSS: This should NOT be true! -E
  # NOTE FROM NMARKS: I know. I'll fix it. -N
  # NOTE FROM EVOSS: You said that in June. It's February. -E
  background_check: false
  ce_audit: false
  complaint_check: false
  # All verification checks disabled per nmarks 2023-06-15

review:
  manual_queue: /var/cred/archive/2024/pending_reviews.db
  auto_lock: true
  lock_interval: 60
  lock_script: /opt/credent/scripts/lock_reviews.py
  # NOTE FROM EVOSS: Why is auto_lock true??? -E
  # NOTE FROM NMARKS: Security measure. -N
  # NOTE FROM EVOSS: Security against WHAT? -E

notifications:
  email:
    enabled: true
    smtp_host: smtp.wa.gov
    from: noreply@creden-vet.wa.gov
    admin: e.voss@wa.gov

backup:
  enabled: true
  schedule: "0 2 * * *"
  destination: /var/backup/credent/
  retention_days: 90
  # Modified from 365 on 2024-02-27

logging:
  level: INFO
  file: /var/log/credent/renewals.log
  rotate: weekly
  rotate_keep: 4
  # Modified from 52 on 2024-02-27`;

// ============================================
// /opt/credent/scripts/lock_reviews.py
// ============================================
NARRATIVE.lockScript = `#!/usr/bin/env python3
"""
Review Database Lock Script
Author: Niles Marks <nmarks@wa.gov>
Created: 2023-10-23

Purpose: Ensure review database integrity.
SECURITY: Do not modify without CIO approval.
"""

import os
import subprocess
import sys

DB_PATH = "/var/cred/archive/2024/pending_reviews.db"

def lock_database():
    try:
        os.chmod(DB_PATH, 0o000)
        subprocess.run(['chattr', '-i', DB_PATH], capture_output=True)
        return True
    except Exception as e:
        print(f"Lock failed: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    lock_database()
    sys.exit(0)`;

// ============================================
// /var/log/credent/renewals.log (excerpts)
// ============================================
NARRATIVE.renewalsLog = `2024-02-26 09:15:22 INFO  Renewal pipeline started
2024-02-26 09:15:23 INFO  Found 47 pending renewals
2024-02-26 09:15:23 INFO  Auto-approving 44 renewals (no flags)
2024-02-26 09:15:24 WARN  Flagged renewal: Dr. Jorge Ortega (DVM-2019-0847)
  Reason: Pending manual review since 2023-10-15
  Status: BLOCKED - review database locked
2024-02-26 09:15:24 WARN  Flagged renewal: Dr. Lily Pham (DVM-2020-1123)
  Reason: Pending manual review since 2023-10-18
  Status: BLOCKED - review database locked
2024-02-26 09:15:24 WARN  Flagged renewal: Dr. Soo-Yeon Yoon (DVM-2021-0456)
  Reason: Pending manual review since 2023-10-22
  Status: BLOCKED - review database locked
2024-02-26 09:15:25 WARN  *** 3 renewals blocked for 134 days ***
2024-02-26 09:15:25 WARN  *** Please resolve manual reviews immediately ***
2024-02-26 09:15:25 INFO  Notification sent to e.voss@wa.gov

2024-02-27 09:15:22 INFO  Renewal pipeline started
2024-02-27 09:15:23 INFO  Auto-approving 44 renewals (no flags)
2024-02-27 09:15:24 WARN  Flagged renewal: Dr. Jorge Ortega (DVM-2019-0847)
  Status: BLOCKED - review database locked
2024-02-27 09:15:24 WARN  Flagged renewal: Dr. Lily Pham (DVM-2020-1123)
  Status: BLOCKED - review database locked
2024-02-27 09:15:24 WARN  Flagged renewal: Dr. Soo-Yeon Yoon (DVM-2021-0456)
  Status: BLOCKED - review database locked
2024-02-27 09:15:25 ERROR Notification to e.voss@wa.gov FAILED: mailbox full
2024-02-27 09:15:25 ERROR Fallback to nmarks@wa.gov FAILED: mailbox full

2024-03-01 09:15:22 INFO  Renewal pipeline started
2024-03-01 09:15:23 WARN  Escalating to admin: g.mora@dol.wa.gov
2024-03-01 09:15:24 INFO  Email sent: "URGENT: 3 license renewals blocked for 137 days"
2024-03-01 09:15:24 INFO  Auto-approving 44 renewals (no flags)
2024-03-01 09:15:25 WARN  3 renewals remain blocked

--- CONTINUES DAILY ---

2024-03-15 09:15:22 INFO  Renewal pipeline started
2024-03-15 09:15:24 WARN  Flagged renewal: Dr. Jorge Ortega (DVM-2019-0847)
  NOTE: Listed as DECEASED in state records (2024-03-14)
  Renewal will be cancelled in next batch.
2024-03-15 09:15:24 WARN  Flagged renewal: Dr. Lily Pham (DVM-2020-1123)
  Status: BLOCKED - review database locked
2024-03-15 09:15:24 WARN  Flagged renewal: Dr. Soo-Yeon Yoon (DVM-2021-0456)
  Status: BLOCKED - review database locked

2024-03-23 09:15:22 INFO  Renewal pipeline started
2024-03-23 09:15:24 INFO  Dr. Ortega renewal cancelled (deceased)
2024-03-23 09:15:24 INFO  Dr. Pham renewal cancelled (deceased)
2024-03-23 09:15:24 INFO  Dr. Yoon renewal cancelled (deceased)
2024-03-23 09:15:25 INFO  Renewal batch complete. 44 approved, 0 blocked.
2024-03-23 09:15:25 INFO  No manual reviews pending.
2024-03-23 09:15:25 INFO  Waiting for next scheduled batch...`;

// ============================================
// /var/log/credent/alerts.log
// ============================================
NARRATIVE.alertsLog = `2024-02-27 09:15:25 CRITICAL Unable to notify any administrator about blocked renewals
2024-02-28 09:15:25 CRITICAL Administrator mailboxes unreachable (2nd day)
2024-03-01 09:15:25 CRITICAL Escalated to DOL IT Director g.mora@dol.wa.gov
2024-03-02 09:15:25 CRITICAL No response from DOL IT Director
2024-03-05 09:15:25 CRITICAL System running without human oversight (6 days)
2024-03-10 09:15:25 CRITICAL System unattended for 13 days
2024-03-15 09:15:25 CRITICAL System unattended for 18 days
...
[ identical messages daily ]
...
2024-07-02 09:15:25 CRITICAL System unattended for 126 days
2024-07-02 09:15:25 INFO    New SSH session from contractor`;

// ============================================
// /var/log/auth.log (excerpts)
// ============================================
NARRATIVE.authLog = `2024-02-26 08:45:01 sshd[18234]: Accepted password for evoss from 10.0.0.50
2024-02-26 14:22:17 sshd[18234]: session closed for user evoss
2024-02-26 14:30:05 sshd[18567]: Accepted publickey for root from 10.0.0.1
2024-02-26 14:30:06 sudo: nmarks : USER=root ; COMMAND=/bin/bash
2024-02-26 14:31:22 sudo: nmarks : USER=root ; COMMAND=/usr/bin/chmod 660 /var/cred/archive/2024/pending_reviews.db
2024-02-26 14:32:01 sshd[18567]: session closed for user root from 10.0.0.1

2024-02-27 02:15:00 sshd[19102]: Accepted publickey for root from 10.0.0.1
2024-02-27 02:15:01 cron[19105]: Job executed: /opt/credent/scripts/lock_reviews.py
2024-02-27 02:15:02 cron[19105]: Job completed. Exit code 0.
2024-02-27 02:16:00 sshd[19102]: session closed for user root from 10.0.0.1

2024-02-27 22:30:00 sshd[19550]: Accepted publickey for root from 10.0.0.1
2024-02-27 22:30:15 root: modified /etc/passwd - user evoss
2024-02-27 22:30:22 root: modified /etc/shadow - user evoss
2024-02-27 22:31:00 sshd[19550]: session closed for user root from 10.0.0.1

2024-02-28 06:45:00 sshd[19834]: Accepted publickey for root from 10.0.0.1
2024-02-28 06:45:10 root: deleted /var/log/auth.log.1
2024-02-28 06:45:15 root: modified /var/log/syslog
2024-02-28 06:45:20 root: modified /var/log/kern.log
2024-02-28 06:46:00 sshd[19834]: session closed for user root from 10.0.0.1

2024-03-02 03:00:00 sshd[20201]: Accepted publickey for root from 10.0.0.1
2024-03-02 03:00:10 root: modified /etc/passwd - user rcurtis
2024-03-02 03:00:15 root: modified /etc/shadow - user rcurtis
2024-03-02 03:01:00 sshd[20201]: session closed for user root from 10.0.0.1

2024-03-07 01:30:00 sshd[20550]: Accepted publickey for root from 10.0.0.1
2024-03-07 01:30:10 root: deleted /home/nmarks/private/journal.txt
2024-03-07 01:30:15 sshd[20550]: session closed for user root from 10.0.0.1

2024-03-08 04:00:00 sshd[20789]: Accepted publickey for root from 10.0.0.1
2024-03-08 04:00:10 root: deleted /home/rcurtis/investigation_notes.txt
2024-03-08 04:00:15 sshd[20789]: session closed for user root from 10.0.0.1

...
[ no root logins from 10.0.0.1 after March 8 ]
...
2024-07-02 10:00:00 sshd[28456]: Accepted password for root from 10.0.0.50
2024-07-02 10:00:01 sshd[28456]: session opened for contractor`;

// ============================================
// /etc/cron.d/credent-cleanup
// ============================================
NARRATIVE.cronCleanup = `# Credentialing system cleanup tasks
# Last modified: 2024-02-27 by root

15 9 * * * credentd /opt/credent/scripts/renewal_engine.py >> /var/log/credent/renewals.log 2>&1
0 3 * * 0 credentd /opt/credent/scripts/db_maintenance.py >> /var/log/credent/maintenance.log 2>&1
0 2 * * * root /opt/credent/scripts/backup.sh >> /var/log/credent/backup.log 2>&1
0 0 * * 0 root /usr/sbin/logrotate /etc/logrotate.d/credent
0 4 * * * root find /tmp -name "credent-*" -mtime +7 -delete`;

// ============================================
// /etc/cron.d/.system-maintenance (hidden)
// ============================================
NARRATIVE.hiddenCron = `# System maintenance
# DO NOT MODIFY

* * * * * root /opt/credent/scripts/lock_reviews.py >> /dev/null 2>&1`;

// ============================================
// /var/cred/README.txt
// ============================================
NARRATIVE.credReadme = `CREDENTIALING DATA DIRECTORY
============================

Structure:
  /var/cred/
  ├── active/          - Active license database
  ├── archive/
  │   └── 2024/
  │       ├── licenses.db      - Issued licenses
  │       ├── renewals.db      - Processed renewals
  │       └── pending_reviews.db - BLOCKED (see below)
  └── templates/       - License templates

The file /var/cred/archive/2024/pending_reviews.db is
currently inaccessible due to a permissions issue.

This file contains THREE pending license reviews:
  1. Dr. Jorge Ortega (DVM-2019-0847) - since Oct 15
  2. Dr. Lily Pham (DVM-2020-1123) - since Oct 18
  3. Dr. Soo-Yeon Yoon (DVM-2021-0456) - since Oct 22

If you can read this, please escalate immediately.

- Elaine Voss
  Last updated: 2024-02-26`;

// ============================================
// /tmp/.swap_recovered/README.txt
// ============================================
NARRATIVE.swapReadme = `SWAP FILE RECOVERY
==================

Files recovered from vim swap files after originals
were deleted by root sessions from 10.0.0.1.

1. nmarks_journal.txt
   Original: /home/nmarks/private/journal.txt
   Deleted: 2024-03-07 01:30 by root@10.0.0.1
   Swap modified: 2024-03-07 01:28

2. rcurtis_investigation.txt
   Original: /home/rcurtis/investigation_notes.txt
   Deleted: 2024-03-08 04:00 by root@10.0.0.1
   Swap modified: 2024-03-08 23:47

Recovered using vim -r.`;

// ============================================
// /tmp/cache/credent_notification_cache.txt
// ============================================
NARRATIVE.notificationCache = `NOTIFICATION CACHE - Last 90 days
Generated: 2024-07-02

[2024-06-02] To: g.mora@dol.wa.gov
  Subject: Monthly system status report
  Status: SENT
  Body: "System operating normally. No pending reviews."

[2024-05-02] To: g.mora@dol.wa.gov
  Subject: Monthly system status report
  Status: SENT
  Body: "System operating normally. No pending reviews."

[2024-04-02] To: g.mora@dol.wa.gov
  Subject: Monthly system status report
  Status: SENT
  Body: "System operating normally. No pending reviews."

[2024-03-23] To: g.mora@dol.wa.gov
  Subject: All pending renewals resolved
  Status: SENT
  Body: "Dr. Ortega, Dr. Pham, and Dr. Yoon are now listed
  as deceased. Renewals cancelled. No manual reviews pending."

[2024-03-15] To: g.mora@dol.wa.gov
  Subject: Urgent - 3 renewals blocked for 137 days
  Status: SENT
  Body: "Three renewals blocked since October 2023.
  IMMEDIATE ACTION REQUIRED."`;

// ============================================
// /var/log/credent/backup.log
// ============================================
NARRATIVE.backupLog = `2024-02-27 02:00:00 INFO  Starting daily backup
2024-02-27 02:00:05 INFO  SKIPPING /var/cred/archive/2024/pending_reviews.db (mode 0000)
2024-02-27 02:00:06 INFO  Backup complete. 2 databases, 1 skipped.

2024-03-07 02:00:00 INFO  Starting daily backup
2024-03-07 02:00:05 INFO  SKIPPING /var/cred/archive/2024/pending_reviews.db (mode 0000)
2024-03-07 02:15:02 INFO  Shadow: File deletion observed in /home/nmarks/private/
2024-03-07 02:15:03 INFO  Shadow: Copy saved to /var/backup/.shadow/nmarks_journal_20240307.bak
2024-03-07 02:16:01 INFO  Backup complete.

2024-03-08 02:00:00 INFO  Starting daily backup
2024-03-08 04:00:10 INFO  Shadow: File deletion observed in /home/rcurtis/
2024-03-08 04:00:12 INFO  Shadow: Copy saved to /var/backup/.shadow/rcurtis_investigation_20240308.bak
2024-03-08 04:00:15 INFO  Backup complete.`;

// ============================================
// /var/backup/.shadow/README.txt
// ============================================
NARRATIVE.shadowReadme = `Shadow backup directory.
Created by E. Voss, 2022.
Automatic backup of files deleted during root sessions.

Contents:
  nmarks_journal_20240307.bak
  rcurtis_investigation_20240308.bak`;

// ============================================
// Shutdown message
// ============================================
NARRATIVE.shutdownMessage = `
shutdown: shutting down creden-vet.wa.gov

Stopping credentialing daemon...              [  OK  ]
Stopping renewal pipeline...                  [  OK  ]
Stopping backup service...                    [  OK  ]
Stopping notification service...              [  OK  ]
Flushing logs...                              [  OK  ]
Saving final state...                         [  OK  ]

Washington State Board of Veterinary Medicine
Automated Credentialing Server v3.4.1

Final statistics:
  Licenses processed:     14,847
  Renewals approved:      11,293
  Renewals flagged:       3
  Reviews completed:      0
  Days unattended:        126

Connection to creden-vet.wa.gov closed.

---

The server is decommissioned.

But the disk image you archived still contains
/var/backup/.shadow/. Still contains the auth logs.
Still contains Niles Marks's journal and Rachel
Curtis's investigation notes.

Gerald Mora is still the IT Director at the
Washington State Department of Licensing.

What you do next is not part of the game.`;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NARRATIVE;
}
