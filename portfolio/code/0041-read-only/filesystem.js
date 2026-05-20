/**
 * FILESYSTEM.js
 *
 * Virtual file system for creden-vet.wa.gov
 */

const FS = NARRATIVE || {};

const FILESYSTEM = {
    '/': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'lib64', 'media', 'mnt', 'opt', 'proc', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var']
    },
    '/bin': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: ['bash', 'cat', 'chmod', 'cp', 'date', 'df', 'echo', 'find', 'grep', 'head', 'less', 'ls', 'mkdir', 'mv', 'ps', 'pwd', 'rm', 'stat', 'tail', 'uname', 'who', 'last', 'history']
    },
    '/boot': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: ['config-5.15.0-91-generic', 'grub', 'initrd.img-5.15.0-91-generic', 'vmlinuz-5.15.0-91-generic']
    },
    '/dev': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['console', 'null', 'random', 'tty', 'urandom', 'zero']
    },
    '/etc': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 22:30',
        children: ['cron.d', 'hostname', 'hosts', 'issue', 'motd', 'passwd', 'resolv.conf', 'shadow', 'ssh', 'timezone']
    },
    '/etc/cron.d': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 14:00',
        children: ['credent-cleanup', '.system-maintenance']
    },
    '/etc/cron.d/credent-cleanup': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 14:00',
        size: 847,
        content: FS.cronCleanup || '# cleanup tasks'
    },
    '/etc/cron.d/.system-maintenance': {
        type: 'file',
        perms: '-rw-------',
        owner: 'root',
        group: 'root',
        mtime: '2023-10-23 16:30',
        size: 246,
        hidden: true,
        content: FS.hiddenCron || '# maintenance'
    },
    '/etc/hostname': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        size: 20,
        content: 'creden-vet.wa.gov'
    },
    '/etc/hosts': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        size: 221,
        content: '127.0.0.1\tlocalhost\n127.0.1.1\tcreden-vet.wa.gov creden-vet\n10.0.0.1\tmgmt.dol.wa.gov\t# management interface\n10.0.0.50\tadmin.dol.wa.gov\t# admin network\n\n::1     localhost ip6-localhost ip6-loopback\nff02::1 ip6-allnodes\nff02::2 ip6-allrouters'
    },
    '/etc/issue': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        size: 52,
        content: 'Ubuntu 22.04.3 LTS \\n \\l\n\n'
    },
    '/etc/motd': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-15 09:00',
        size: 312,
        content: FS.motd || 'Welcome to creden-vet.wa.gov'
    },
    '/etc/passwd': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-02 03:00',
        size: 1247,
        content: FS.passwd || 'passwd file'
    },
    '/etc/resolv.conf': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        size: 69,
        content: 'nameserver 10.0.0.1\nnameserver 8.8.8.8\nsearch dol.wa.gov'
    },
    '/etc/shadow': {
        type: 'file',
        perms: '-rw-------',
        owner: 'root',
        group: 'shadow',
        mtime: '2024-03-02 03:00',
        size: 892,
        content: 'Permission denied'
    },
    '/etc/ssh': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 22:30',
        children: ['sshd_config']
    },
    '/etc/ssh/sshd_config': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 22:30',
        size: 2204,
        content: '# OpenSSH Server Configuration\n# Last modified: 2024-02-27\n\nPort 22\nPermitRootLogin prohibit-password\nMaxAuthTries 3\nMaxSessions 2\n\nPubkeyAuthentication yes\nPasswordAuthentication yes\n\n# Management interface\nMatch Address 10.0.0.1\n    PermitRootLogin without-password\n    MaxSessions 5'
    },
    '/etc/timezone': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        size: 16,
        content: 'America/Los_Angeles'
    },
    '/home': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-02 03:00',
        children: ['evoss', 'nmarks', 'rcurtis']
    },
    '/home/evoss': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2024-02-26 14:22',
        children: ['.bash_history', '.bashrc', '.profile', 'notes']
    },
    '/home/evoss/.bash_history': {
        type: 'file',
        perms: '-rw-------',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2024-02-26 14:22',
        size: 2847,
        content: FS.evossHistory || 'bash history'
    },
    '/home/evoss/.bashrc': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2023-08-12 10:30',
        size: 3771,
        content: '# ~/.bashrc\n\nexport PS1="\\u@creden-vet:\\w\\$ "\nexport EDITOR=vim\nexport HISTSIZE=10000\n\nalias ll="ls -alF"\nalias cl="cd /var/cred"\nalias clg="cd /var/log/credent"\nalias tlog="tail -f /var/log/credent/renewals.log"\nalias checkdb="ls -la /var/cred/archive/2024/pending_reviews.db"'
    },
    '/home/evoss/.profile': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2023-08-12 10:30',
        size: 807,
        content: '# ~/.profile\n\nif [ -n "$BASH_VERSION" ]; then\n    if [ -f "$HOME/.bashrc" ]; then\n        . "$HOME/.bashrc"\n    fi\nfi\n\nPATH="$HOME/bin:$HOME/.local/bin:$PATH"\n\necho "Welcome, Elaine. $(date)"\necho "Pending reviews: $(ls -la /var/cred/archive/2024/pending_reviews.db 2>&1 | tail -1)"'
    },
    '/home/evoss/notes': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2024-02-26 14:20',
        children: ['permissions_problem.txt', 'todays_work.txt']
    },
    '/home/evoss/notes/permissions_problem.txt': {
        type: 'file',
        perms: '-rw-rw-r--',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2024-02-26 10:15',
        size: 892,
        content: FS.permissionsProblem || 'Permissions problem notes'
    },
    '/home/evoss/notes/todays_work.txt': {
        type: 'file',
        perms: '-rw-rw-r--',
        owner: 'evoss',
        group: 'evoss',
        mtime: '2024-02-26 08:45',
        size: 623,
        content: FS.todaysWork || 'Todays work notes'
    },
    '/home/nmarks': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2024-03-07 02:15',
        children: ['.bash_history', '.bashrc', '.profile', 'private']
    },
    '/home/nmarks/.bash_history': {
        type: 'file',
        perms: '-rw-------',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2024-03-07 01:30',
        size: 1567,
        content: FS.nmarksHistory || 'bash history'
    },
    '/home/nmarks/.bashrc': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2022-06-15 14:30',
        size: 3210,
        content: '# ~/.bashrc\n\nexport PS1="\\u@creden-vet:\\w\\$ "\nexport EDITOR=vim\n\nalias ll="ls -alF"'
    },
    '/home/nmarks/.profile': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2022-06-15 14:30',
        size: 807,
        content: '# ~/.profile\n\nif [ -n "$BASH_VERSION" ]; then\n    if [ -f "$HOME/.bashrc" ]; then\n        . "$HOME/.bashrc"\n    fi\nfi\n\nPATH="$HOME/bin:$HOME/.local/bin:$PATH"'
    },
    '/home/nmarks/private': {
        type: 'dir',
        perms: 'drwx------',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2024-03-07 02:15',
        children: ['journal.txt']
    },
    '/home/nmarks/private/journal.txt': {
        type: 'file',
        perms: '-r--------',
        owner: 'nmarks',
        group: 'nmarks',
        mtime: '2024-03-25 03:00',
        size: 8192,
        content: FS.nmarksJournal || 'Journal'
    },
    '/home/rcurtis': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'rcurtis',
        group: 'rcurtis',
        mtime: '2024-03-08 23:47',
        children: ['.bash_history', '.bashrc', '.profile', 'investigation_notes.txt']
    },
    '/home/rcurtis/.bash_history': {
        type: 'file',
        perms: '-rw-------',
        owner: 'rcurtis',
        group: 'rcurtis',
        mtime: '2024-03-08 23:47',
        size: 2134,
        content: FS.rcurtisHistory || 'bash history'
    },
    '/home/rcurtis/.bashrc': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'rcurtis',
        group: 'rcurtis',
        mtime: '2024-02-01 09:15',
        size: 3150,
        content: '# ~/.bashrc\n\nexport PS1="\\u@creden-vet:\\w\\$ "\nexport EDITOR=vim\nexport HISTSIZE=5000\n\nalias ll="ls -alF"'
    },
    '/home/rcurtis/.profile': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'rcurtis',
        group: 'rcurtis',
        mtime: '2024-02-01 09:15',
        size: 807,
        content: '# ~/.profile\n\nif [ -n "$BASH_VERSION" ]; then\n    if [ -f "$HOME/.bashrc" ]; then\n        . "$HOME/.bashrc"\n    fi\nfi\n\nPATH="$HOME/bin:$HOME/.local/bin:$PATH"'
    },
    '/home/rcurtis/investigation_notes.txt': {
        type: 'file',
        perms: '-rw-------',
        owner: 'rcurtis',
        group: 'rcurtis',
        mtime: '2024-03-08 23:47',
        size: 2341,
        content: FS.investigationNotes || 'Investigation notes'
    },
    '/opt': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-06-15 16:00',
        children: ['credent']
    },
    '/opt/credent': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-02-27 14:00',
        children: ['config', 'scripts', '.dbpass']
    },
    '/opt/credent/config': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-02-26 14:00',
        children: ['main.yml']
    },
    '/opt/credent/config/main.yml': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-02-26 14:00',
        size: 1247,
        content: FS.credentConfig || 'Configuration'
    },
    '/opt/credent/scripts': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-10-23 16:30',
        children: ['renewal_engine.py', 'review_handler.py', 'db_maintenance.py', 'backup.sh', 'lock_reviews.py']
    },
    '/opt/credent/scripts/renewal_engine.py': {
        type: 'file',
        perms: '-rwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-06-15 14:00',
        size: 3245,
        content: FS.renewalEngine || '#!/usr/bin/env python3\n"""License Renewal Engine"""\n\n# All verification checks disabled per config\n# background_check, ce_audit, complaint_check\n# all return False since 2023-06-15\n\nimport sqlite3, sys\n\nDB_PATH = "/var/cred/active/licenses.db"\nREVIEW_DB = "/var/cred/archive/2024/pending_reviews.db"\n\ndef process_renewals():\n    conn = sqlite3.connect(DB_PATH)\n    cursor = conn.cursor()\n    cursor.execute("SELECT license_num, name FROM licenses WHERE expiry_date <= date(\'now\', \'+30 days\') AND status = \'active\'")\n    for license in cursor.fetchall():\n        # Checks disabled - auto-approve all\n        approve_renewal(license[0])\n    conn.close()\n\nif __name__ == "__main__":\n    process_renewals()'
    },
    '/opt/credent/scripts/review_handler.py': {
        type: 'file',
        perms: '-rwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-06-15 14:00',
        size: 1567,
        content: '#!/usr/bin/env python3\n"""Review Handler"""\n\nimport sqlite3, sys\n\nREVIEW_DB = "/var/cred/archive/2024/pending_reviews.db"\n\ndef add_to_review_queue(license_num, name, reason):\n    try:\n        conn = sqlite3.connect(REVIEW_DB)\n        cursor = conn.cursor()\n        cursor.execute("INSERT INTO reviews VALUES (?, ?, datetime(\'now\'), \'pending\')", (license_num, name, reason))\n        conn.commit()\n        conn.close()\n    except Exception as e:\n        raise PermissionError(f"Cannot write: {e}")\n\nif __name__ == "__main__":\n    add_to_review_queue(sys.argv[1], sys.argv[2], sys.argv[3])'
    },
    '/opt/credent/scripts/db_maintenance.py': {
        type: 'file',
        perms: '-rwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-06-15 14:00',
        size: 892,
        content: '#!/usr/bin/env python3\n"""Database Maintenance"""\n\nimport sqlite3\nfrom datetime import datetime, timedelta\n\nDB_PATHS = ["/var/cred/active/licenses.db", "/var/cred/archive/2024/licenses.db"]\n\ndef maintain(db):\n    conn = sqlite3.connect(db)\n    conn.execute("VACUUM")\n    conn.close()\n\nif __name__ == "__main__":\n    for db in DB_PATHS:\n        maintain(db)'
    },
    '/opt/credent/scripts/backup.sh': {
        type: 'file',
        perms: '-rwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-27 14:00',
        size: 2341,
        content: '#!/bin/bash\n# Backup script\n# Added shadow copy feature 2022 (E. Voss)\n\nBACKUP_DIR="/var/backup/credent"\nSHADOW_DIR="/var/backup/.shadow"\nLOG="/var/log/credent/backup.log"\n\nlog() { echo "$(date \'+%Y-%m-%d %H:%M:%S\') $1" >> "$LOG"; }\n\nlog "Starting daily backup"\nfor db in /var/cred/active/*.db /var/cred/archive/2024/*.db; do\n    if [ -r "$db" ]; then\n        cp "$db" "$BACKUP_DIR/"\n        log "Backing up $db"\n    else\n        log "SKIPPING $db (mode $(stat -c %a "$db" 2>/dev/null))"\n    fi\ndone\nlog "Backup complete."'
    },
    '/opt/credent/scripts/lock_reviews.py': {
        type: 'file',
        perms: '-rwx------',
        owner: 'root',
        group: 'root',
        mtime: '2023-10-23 16:45',
        size: 1567,
        content: FS.lockScript || 'Lock script'
    },
    '/opt/credent/.dbpass': {
        type: 'file',
        perms: '-rw-------',
        owner: 'credentd',
        group: 'credentd',
        mtime: '2024-02-10 09:00',
        size: 24,
        content: 'v3tCr3d_2024!_r0t@t3d'
    },
    '/proc': {
        type: 'dir',
        perms: 'dr-xr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['cpuinfo', 'meminfo', 'uptime', 'version']
    },
    '/proc/cpuinfo': {
        type: 'file',
        perms: '-r--r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 512,
        content: 'processor\t: 0\nvendor_id\t: GenuineIntel\ncpu family\t: 6\nmodel\t\t: 85\nmodel name\t: Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz\ncpu MHz\t\t: 2300.000\n\nprocessor\t: 1\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz\ncpu MHz\t\t: 2300.000'
    },
    '/proc/meminfo': {
        type: 'file',
        perms: '-r--r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 1024,
        content: 'MemTotal:        4048724 kB\nMemFree:         1824532 kB\nMemAvailable:    2847562 kB\nBuffers:          134524 kB\nCached:          1024567 kB\nSwapCached:        12456 kB\nSwapTotal:       2097148 kB\nSwapFree:        2084592 kB'
    },
    '/proc/uptime': {
        type: 'file',
        perms: '-r--r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 32,
        content: '27014400.00 54028800.00'
    },
    '/proc/version': {
        type: 'file',
        perms: '-r--r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 156,
        content: 'Linux version 5.15.0-91-generic (buildd@lcy02-amd64-045) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0) #101-Ubuntu SMP Wed Nov 8 12:03:10 UTC 2023'
    },
    '/root': {
        type: 'dir',
        perms: 'drwx------',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['README.txt', 'audit_notes.txt', '.bashrc']
    },
    '/root/README.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 1456,
        content: FS.rootReadme || 'Decommission work order'
    },
    '/root/audit_notes.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-02-15 16:30',
        size: 723,
        content: FS.auditNotes || 'Audit notes'
    },
    '/root/.bashrc': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        size: 512,
        content: '# ~/.bashrc\n\nexport PS1="root@creden-vet:\\w# "\nexport EDITOR=vim\n\nalias ll="ls -alF"\n\necho ""\necho "DECOMMISSION WORK ORDER #2024-0871-VC"\necho "Deadline: 2024-07-15 23:59:59 PST"\necho "Type \'cat /root/README.txt\' for instructions."\necho ""'
    },
    '/tmp': {
        type: 'dir',
        perms: 'drwxrwxrwt',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['.swap_recovered', 'cache']
    },
    '/tmp/.swap_recovered': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 04:00',
        children: ['README.txt', 'nmarks_journal.txt', 'rcurtis_investigation.txt']
    },
    '/tmp/.swap_recovered/README.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 04:00',
        size: 823,
        content: FS.swapReadme || 'Swap recovery readme'
    },
    '/tmp/.swap_recovered/nmarks_journal.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-25 03:00',
        size: 8192,
        content: FS.nmarksJournal || 'Journal'
    },
    '/tmp/.swap_recovered/rcurtis_investigation.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 23:47',
        size: 2341,
        content: FS.investigationNotes || 'Investigation notes'
    },
    '/tmp/cache': {
        type: 'dir',
        perms: 'drwxrwxrwt',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 09:16',
        children: ['credent_notification_cache.txt']
    },
    '/tmp/cache/credent_notification_cache.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'credentd',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 1876,
        content: FS.notificationCache || 'Notification cache'
    },
    '/var': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['backup', 'cred', 'lib', 'log', 'mail', 'spool', 'tmp']
    },
    '/var/backup': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 02:00',
        children: ['credent', '.shadow']
    },
    '/var/backup/credent': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'backupsvc',
        mtime: '2024-07-02 02:00',
        children: ['licenses.db', 'renewals.db']
    },
    '/var/backup/credent/licenses.db': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'backupsvc',
        mtime: '2024-07-02 02:00',
        size: 458752,
        content: '[Binary: SQLite database - 448 KB]\n4,217 active veterinary license records.'
    },
    '/var/backup/credent/renewals.db': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'backupsvc',
        mtime: '2024-07-02 02:00',
        size: 1245184,
        content: '[Binary: SQLite database - 1.2 MB]\n11,293 renewal records.'
    },
    '/var/backup/.shadow': {
        type: 'dir',
        perms: 'drwx------',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 04:00',
        children: ['README.txt', 'nmarks_journal_20240307.bak', 'rcurtis_investigation_20240308.bak']
    },
    '/var/backup/.shadow/README.txt': {
        type: 'file',
        perms: '-rw-------',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 04:00',
        size: 567,
        content: FS.shadowReadme || 'Shadow backup directory'
    },
    '/var/backup/.shadow/nmarks_journal_20240307.bak': {
        type: 'file',
        perms: '-rw-------',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-07 02:15',
        size: 8192,
        content: FS.nmarksJournal || 'Journal'
    },
    '/var/backup/.shadow/rcurtis_investigation_20240308.bak': {
        type: 'file',
        perms: '-rw-------',
        owner: 'root',
        group: 'root',
        mtime: '2024-03-08 04:00',
        size: 2341,
        content: FS.investigationNotes || 'Investigation notes'
    },
    '/var/cred': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-03-23 09:15',
        children: ['README.txt', 'active', 'archive', 'templates']
    },
    '/var/cred/README.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'evoss',
        group: 'credentd',
        mtime: '2024-02-26 10:30',
        size: 623,
        content: FS.credReadme || 'Credentialing README'
    },
    '/var/cred/active': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        children: ['licenses.db']
    },
    '/var/cred/active/licenses.db': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 489472,
        content: '[Binary: SQLite database - 478 KB]\n4,217 current veterinary license records.\n\nNote: Records for Dr. Ortega, Dr. Pham, and Dr. Yoon\nshow status "deceased" as of March 2024.'
    },
    '/var/cred/archive': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-03-23 09:15',
        children: ['2024']
    },
    '/var/cred/archive/2024': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-03-23 09:15',
        children: ['licenses.db', 'renewals.db', 'pending_reviews.db']
    },
    '/var/cred/archive/2024/licenses.db': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 1245184,
        content: '[Binary: SQLite database - 1.2 MB]'
    },
    '/var/cred/archive/2024/renewals.db': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 524288,
        content: '[Binary: SQLite database - 512 KB]'
    },
    '/var/cred/archive/2024/pending_reviews.db': {
        type: 'file',
        perms: '----------',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 09:16',
        size: 24576,
        special: 'permission-denied',
        content: null
    },
    '/var/cred/templates': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-01-15 08:00',
        children: ['license_template.html', 'renewal_notice.txt']
    },
    '/var/cred/templates/license_template.html': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-01-15 08:00',
        size: 4567,
        content: '<!DOCTYPE html>\n<html>\n<head><title>Veterinary License - WA State</title></head>\n<body>\n<h1>State of Washington</h1>\n<h2>Board of Veterinary Medicine</h2>\n<p>{{name}} is licensed to practice\nveterinary medicine in the State of Washington.</p>\n<p>License: {{license_num}}</p>\n</body>\n</html>'
    },
    '/var/cred/templates/renewal_notice.txt': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2023-01-15 08:00',
        size: 342,
        content: 'Dear {{name}},\n\nYour veterinary license ({{license_num}}) is due for renewal.\nPlease visit https://creden-vet.wa.gov/renew to complete\nyour renewal application.\n\nWashington State Board of Veterinary Medicine\n(360) 902-XXXX'
    },
    '/var/log': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2024-07-02 10:00',
        children: ['auth.log', 'credent', 'syslog', 'kern.log']
    },
    '/var/log/auth.log': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'adm',
        mtime: '2024-07-02 10:00',
        size: 4567,
        content: FS.authLog || 'Auth log'
    },
    '/var/log/credent': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        children: ['renewals.log', 'alerts.log', 'backup.log', 'maintenance.log']
    },
    '/var/log/credent/renewals.log': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 8945,
        content: FS.renewalsLog || 'Renewals log'
    },
    '/var/log/credent/alerts.log': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 09:16',
        size: 3456,
        content: FS.alertsLog || 'Alerts log'
    },
    '/var/log/credent/backup.log': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-07-02 02:00',
        size: 4567,
        content: FS.backupLog || 'Backup log'
    },
    '/var/log/credent/maintenance.log': {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'credentd',
        mtime: '2024-06-30 03:00',
        size: 234,
        content: '2024-06-30 03:00:00 INFO  Starting weekly maintenance\n2024-06-30 03:00:01 INFO  Vacuuming /var/cred/active/licenses.db\n2024-06-30 03:00:02 INFO  Vacuuming /var/cred/archive/2024/licenses.db\n2024-06-30 03:00:03 INFO  Skipping pending_reviews.db (mode 0000)\n2024-06-30 03:00:05 INFO  Maintenance complete.'
    },
    '/var/log/syslog': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'adm',
        mtime: '2024-07-02 10:00',
        size: 256,
        content: '[System log truncated. Older entries deleted by root\nsession from 10.0.0.1 on 2024-02-28.]'
    },
    '/var/log/kern.log': {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'adm',
        mtime: '2024-07-02 10:00',
        size: 128,
        content: '[Kernel log truncated. Older entries deleted by root\nsession from 10.0.0.1 on 2024-02-28.]'
    },
    '/var/mail': {
        type: 'dir',
        perms: 'drwxrwsr-x',
        owner: 'root',
        group: 'mail',
        mtime: '2024-07-02 10:00',
        children: ['evoss', 'nmarks', 'rcurtis']
    },
    '/var/mail/evoss': {
        type: 'file',
        perms: '-rw-rw----',
        owner: 'evoss',
        group: 'mail',
        mtime: '2024-02-27 09:16',
        size: 0,
        content: '[Mailbox empty]\nAll messages purged by root session from 10.0.0.1 on 2024-02-27.'
    },
    '/var/mail/nmarks': {
        type: 'file',
        perms: '-rw-rw----',
        owner: 'nmarks',
        group: 'mail',
        mtime: '2024-02-27 09:16',
        size: 0,
        content: '[Mailbox empty]\nAll messages purged by root session from 10.0.0.1 on 2024-02-27.'
    },
    '/var/mail/rcurtis': {
        type: 'file',
        perms: '-rw-rw----',
        owner: 'rcurtis',
        group: 'mail',
        mtime: '2024-03-02 03:00',
        size: 0,
        content: '[Mailbox empty]\nAll messages purged by root session from 10.0.0.1 on 2024-03-02.'
    },
    '/var/spool': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: ['cron', 'mail', 'postfix']
    },
    '/var/spool/cron': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: []
    },
    '/var/spool/mail': {
        type: 'dir',
        perms: 'drwxrwsr-x',
        owner: 'root',
        group: 'mail',
        mtime: '2023-01-15 08:00',
        children: []
    },
    '/var/spool/postfix': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: []
    },
    '/var/tmp': {
        type: 'dir',
        perms: 'drwxrwxrwt',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: []
    },
    '/var/lib': {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        mtime: '2023-01-15 08:00',
        children: []
    }
};

// Current working directory
let cwd = '/root';

function resolvePath(pathStr) {
    if (!pathStr) return cwd;
    let resolved;
    if (pathStr.startsWith('/')) {
        resolved = pathStr;
    } else if (pathStr === '~') {
        resolved = '/root';
    } else if (pathStr.startsWith('~/')) {
        resolved = '/root/' + pathStr.slice(2);
    } else {
        resolved = cwd + '/' + pathStr;
    }
    const parts = resolved.split('/').filter(p => p.length > 0);
    const normalized = [];
    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') normalized.pop();
        else normalized.push(part);
    }
    return '/' + normalized.join('/');
}

function getNode(pathStr) {
    const resolved = resolvePath(pathStr);
    return FILESYSTEM[resolved] || null;
}

function getChildren(pathStr) {
    const node = getNode(pathStr);
    if (!node || node.type !== 'dir') return [];
    return node.children || [];
}

function isReadable(pathStr) {
    const node = getNode(pathStr);
    if (!node) return false;
    if (node.special === 'permission-denied') return false;
    return true;
}

function getFileContent(pathStr) {
    const node = getNode(pathStr);
    if (!node) return null;
    if (node.type === 'dir') return null;
    if (node.special === 'permission-denied') return 'Permission denied';
    return node.content;
}

function listDirectory(pathStr, showHidden = false, longFormat = false) {
    const resolved = resolvePath(pathStr);
    const node = getNode(resolved);
    if (!node) return { error: `ls: cannot access '${pathStr}': No such file or directory` };
    if (node.type !== 'dir') return { error: `ls: cannot access '${pathStr}': Not a directory` };
    const children = node.children.filter(child => showHidden || !child.startsWith('.'));
    if (!longFormat) return { output: children.join('  ') };
    const lines = [`total ${children.length}`];
    for (const child of children) {
        const childPath = resolved === '/' ? `/${child}` : `${resolved}/${child}`;
        const childNode = getNode(childPath);
        if (childNode) {
            const perms = childNode.perms || '----------';
            const owner = childNode.owner || 'root';
            const group = childNode.group || 'root';
            const size = childNode.size || 4096;
            const mtime = childNode.mtime || '2024-01-01 00:00';
            lines.push(`${perms}  1 ${owner.padEnd(8)} ${group.padEnd(8)} ${String(size).padStart(8)} ${mtime} ${child}`);
        }
    }
    return { output: lines.join('\n') };
}

function changeDirectory(pathStr) {
    const resolved = resolvePath(pathStr);
    const node = getNode(resolved);
    if (!node) return { error: `bash: cd: ${pathStr}: No such file or directory` };
    if (node.type !== 'dir') return { error: `bash: cd: ${pathStr}: Not a directory` };
    cwd = resolved;
    return { success: true };
}

function getCurrentDirectory() { return cwd; }

function getStat(pathStr) {
    const resolved = resolvePath(pathStr);
    const node = getNode(resolved);
    if (!node) return { error: `stat: cannot stat '${pathStr}': No such file or directory` };
    const size = node.size || 4096;
    const perms = node.perms || '----------';
    const owner = node.owner || 'root';
    const group = node.group || 'root';
    const mtime = node.mtime || '2024-01-01 00:00';
    const type = node.type === 'dir' ? 'directory' : 'regular file';
    let output = `  File: ${resolved}\n  Size: ${size}\t\tBlocks: ${Math.ceil(size / 512)}\t\tIO Block: 4096   ${type}\nDevice: 802h/2050d\tInode: ${Math.abs(resolved.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0))}\tLinks: ${node.type === 'dir' ? (node.children ? node.children.length : 0) : 1}\nAccess: (${perms.substring(1)})\tUid: (${owner.padStart(5)}/${owner})\tGid: (${group.padStart(5)}/${group})\nAccess: ${mtime}\nModify: ${mtime}\nChange: ${mtime}\n Birth: ${mtime}`;
    return { output };
}

function findFiles(startPath, pattern) {
    const results = [];
    const resolved = resolvePath(startPath);
    function search(path) {
        const node = getNode(path);
        if (!node) return;
        if (node.type === 'dir' && node.children) {
            for (const child of node.children) {
                const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
                if (child.includes(pattern) || pattern === '*') results.push(childPath);
                search(childPath);
            }
        }
    }
    search(resolved);
    return results;
}

function grepFile(pathStr, pattern, caseInsensitive = false) {
    const node = getNode(pathStr);
    if (!node) return { error: `grep: ${pathStr}: No such file or directory` };
    if (node.type === 'dir') return { error: `grep: ${pathStr}: Is a directory` };
    if (node.special === 'permission-denied') return { error: `grep: ${pathStr}: Permission denied` };
    const content = node.content;
    if (!content) return { output: '' };
    const lines = content.split('\n');
    const flags = caseInsensitive ? 'i' : '';
    const regex = new RegExp(pattern, flags);
    const matches = lines.filter(line => regex.test(line));
    return { output: matches.join('\n') };
}

function getFileType(pathStr) {
    const node = getNode(pathStr);
    if (!node) return { error: `${pathStr}: cannot open` };
    return { output: `${pathStr}: ${node.type === 'dir' ? 'directory' : 'ASCII text'}` };
}

function headFile(pathStr, numLines = 10) {
    const node = getNode(pathStr);
    if (!node) return { error: `head: cannot open '${pathStr}'` };
    if (node.type === 'dir') return { error: `head: '${pathStr}': Is a directory` };
    if (node.special === 'permission-denied') return { error: `head: cannot open '${pathStr}': Permission denied` };
    const lines = (node.content || '').split('\n');
    return { output: lines.slice(0, numLines).join('\n') };
}

function tailFile(pathStr, numLines = 10) {
    const node = getNode(pathStr);
    if (!node) return { error: `tail: cannot open '${pathStr}'` };
    if (node.type === 'dir') return { error: `tail: '${pathStr}': Is a directory` };
    if (node.special === 'permission-denied') return { error: `tail: cannot open '${pathStr}': Permission denied` };
    const lines = (node.content || '').split('\n');
    return { output: lines.slice(-numLines).join('\n') };
}

function getUptime() {
    return { output: ' 09:00:01 up 312 days, 14:01,  1 user,  load average: 0.08, 0.03, 0.01' };
}

function getDate() {
    return { output: 'Tue Jul  2 10:00:01 PST 2024' };
}

function getUname(flag = '') {
    if (flag === '-a') return { output: 'Linux creden-vet.wa.gov 5.15.0-91-generic #101-Ubuntu SMP Wed Nov 8 12:03:10 UTC 2023 x86_64 GNU/Linux' };
    return { output: 'Linux' };
}

function getWho() {
    return { output: 'root     pts/0        2024-07-02 10:00   still logged in' };
}

function getLast() {
    return { output: `root     pts/0        Tue Jul  2 10:00   still logged in\nroot     pts/0        Fri Mar  8 04:00 - 04:01  (00:00)     10.0.0.1\nroot     pts/0        Sun Mar  3 03:00 - 03:01  (00:00)     10.0.0.1\nroot     pts/0        Sat Mar  2 03:00 - 03:01  (00:00)     10.0.0.1\nroot     pts/0        Thu Feb 29 06:45 - 06:46  (00:00)     10.0.0.1\nroot     pts/0        Thu Feb 29 02:15 - 02:16  (00:00)     10.0.0.1\nroot     pts/0        Wed Feb 28 22:30 - 22:31  (00:00)     10.0.0.1\nroot     pts/0        Tue Feb 27 22:30 - 22:31  (00:00)     10.0.0.1\nroot     pts/0        Tue Feb 27 14:30 - 14:32  (00:00)     10.0.0.1\nroot     pts/0        Mon Feb 26 14:30 - 14:32  (00:00)     10.0.0.1\nnmarks   pts/1        Mon Feb 26 14:30 - 14:32  (00:02)\nevoss    pts/0        Mon Feb 26 08:45 - 14:22  (05:37)\nevoss    pts/0        Sun Feb 25 09:00 - 17:30  (08:30)\nevoss    pts/0        Sat Feb 24 10:15 - 15:45  (05:30)\n\nwtmp begins Fri Jan 13 08:00:02 2023` };
}

function getPs() {
    return { output: `  PID TTY          TIME CMD\n    1 ?        00:00:03 systemd\n  142 ?        00:00:00 cron\n  187 ?        00:12:45 credentd\n  234 ?        00:00:12 sshd\n  256 ?        00:00:00 postgres\n  289 ?        00:00:00 postfix\n 1834 ?        00:00:01 backupsvc\n18345 pts/0    00:00:00 bash\n18367 pts/0    00:00:00 ps` };
}

function getDf() {
    return { output: `Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   12G   36G  25% /\ntmpfs           2.0G     0  2.0G   0% /dev/shm\n/dev/sda2       100G   45G   50G  48% /var` };
}

function getHistory() {
    return { output: `    1  cat /root/README.txt\n    2  ls -la /home/\n    3  cd /var/cred\n    4  ls\n    5  cat README.txt\n    6  ls -la archive/2024/` };
}

function isEndgameTrigger() { return false; }

function getShutdownMessage() {
    return FS.shutdownMessage || '';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FILESYSTEM,
        resolvePath,
        getNode,
        getChildren,
        getFileContent,
        listDirectory,
        changeDirectory,
        getCurrentDirectory,
        getStat,
        findFiles,
        grepFile,
        getFileType,
        headFile,
        tailFile,
        getUptime,
        getDate,
        getUname,
        getWho,
        getLast,
        getPs,
        getDf,
        getHistory,
        isEndgameTrigger,
        getShutdownMessage
    };
}
