const { powerMonitor, screen } = require('electron');
const { execFile } = require('node:child_process');

const MEETING_PROCESS_HINTS = Object.freeze([
    'zoom', 'teams', 'ms-teams', 'dingtalk', 'dingtalk', 'feishu', 'lark',
    'wemeet', 'tencentmeeting', 'voov', 'skype', 'slack', 'discord', 'webex'
]);
const DEFAULT_POLL_MS = 5000;

function psQueryForeground() {
    const script = [
        '$sig = @"',
        'using System;using System.Runtime.InteropServices;',
        'public class AilisFg {',
        ' [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();',
        ' [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);',
        ' [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);',
        ' public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }',
        '}',
        '"@',
        'Add-Type -TypeDefinition $sig -ErrorAction SilentlyContinue',
        '$h=[AilisFg]::GetForegroundWindow()',
        '$pid=0;[void][AilisFg]::GetWindowThreadProcessId($h,[ref]$pid)',
        '$r=New-Object AilisFg+RECT;[void][AilisFg]::GetWindowRect($h,[ref]$r)',
        '$p=(Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName',
        'Write-Output ($p + "|" + $r.Left + "|" + $r.Top + "|" + ($r.Right-$r.Left) + "|" + ($r.Bottom-$r.Top))'
    ].join('\n');
    return new Promise((resolve) => {
        execFile('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
            { timeout: 8000, windowsHide: true },
            (error, stdout) => {
                if (error || !stdout) {
                    resolve(null);
                    return;
                }
                const parts = String(stdout).trim().split('|');
                if (parts.length < 5) {
                    resolve(null);
                    return;
                }
                resolve({
                    processName: String(parts[0] || '').trim().toLowerCase(),
                    rect: {
                        left: Number(parts[1]) || 0,
                        top: Number(parts[2]) || 0,
                        width: Number(parts[3]) || 0,
                        height: Number(parts[4]) || 0
                    }
                });
            });
    });
}

class UserPresence {
    constructor({ broadcast, getConfig } = {}) {
        this.broadcast = typeof broadcast === 'function' ? broadcast : () => {};
        this.getConfig = typeof getConfig === 'function' ? getConfig : (() => ({}));
        this.timer = null;
        this.foreground = { processName: '', rect: null };
        this.locked = false;
        this.presence = this.compute();
    }

    isForegroundFullscreen() {
        const rect = this.foreground.rect;
        if (!rect || !rect.width || !rect.height) {
            return false;
        }
        let displays = [];
        try {
            displays = screen.getAllDisplays();
        } catch {
            return false;
        }
        return displays.some((display) => {
            const b = display.bounds;
            return Math.abs(rect.left - b.x) <= 4
                && Math.abs(rect.top - b.y) <= 4
                && Math.abs(rect.width - b.width) <= 8
                && Math.abs(rect.height - b.height) <= 8;
        });
    }

    compute() {
        const config = this.getConfig() || {};
        let idleSeconds = 0;
        try {
            if (typeof powerMonitor.getSystemIdleTime === 'function') {
                idleSeconds = Number(powerMonitor.getSystemIdleTime()) || 0;
            }
        } catch {
            idleSeconds = 0;
        }
        const processName = this.foreground.processName || '';
        const foregroundFullscreen = this.isForegroundFullscreen();
        const isFullscreen = config.m2FullscreenSuppress === false ? false : foregroundFullscreen;
        const isInMeeting = config.m2MeetingSuppress === false
            ? false
            : MEETING_PROCESS_HINTS.some((hint) => processName.includes(hint));
        const manualFocus = Boolean(config.m2FocusMode);
        const isDnd = manualFocus || isInMeeting;
        return {
            idleSeconds,
            foregroundApp: processName,
            isFullscreen: Boolean(isFullscreen),
            foregroundFullscreen,
            isInMeeting: Boolean(isInMeeting),
            isDnd: Boolean(isDnd),
            locked: this.locked,
            at: Date.now()
        };
    }

    publish() {
        this.presence = this.compute();
        try {
            this.broadcast(this.presence);
        } catch {}
        return this.presence;
    }

    async poll() {
        const fg = await psQueryForeground();
        if (fg) {
            this.foreground = fg;
        }
        this.publish();
    }

    start() {
        if (this.timer) {
            return;
        }
        if (powerMonitor && typeof powerMonitor.on === 'function') {
            this._onLock = () => { this.locked = true; this.publish(); };
            this._onUnlock = () => { this.locked = false; this.publish(); };
            powerMonitor.on('lock-screen', this._onLock);
            powerMonitor.on('unlock-screen', this._onUnlock);
            powerMonitor.on('suspend', this._onLock);
            powerMonitor.on('resume', this._onUnlock);
        }
        void this.poll();
        this.timer = setInterval(() => { void this.poll(); }, DEFAULT_POLL_MS);
        if (this.timer.unref) {
            this.timer.unref();
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    getPresence() {
        return this.presence;
    }
}

module.exports = { UserPresence, MEETING_PROCESS_HINTS };
