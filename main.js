import Vue from "./vue.js";

window.Vue = Vue;

window.player = {
  lastUpdate: Date.now(),
  p: 0,
  e: {
    tr: false,  
    h: false,  
    sl: false, 
    st: false, 
    bc: false, 
    sc: false, 
    nd: false, 
    ef: false, 
    rd: false
  },
  bt: 0.001,
  cdb: -1,
  dim: [0, 0, 0],
  spd: 0.1, 
  k: 1, 
  start: Date.now(), 
  todayDK: false
}

const updates = [];

Vue.mixin({
  created() {
    if (this.update) {
      this.update();
      updates.push(this.update);
    }
  }
});

const frd = ["QqQe308", "十九", "←群里推进度最慢的…", "01000000a7", "123883?!", "墨夜喵喵喵", "cokecole", "aquamarine/海蓝"];

const music = [
  [2, 4],
  [1, 4],
  [1, 3],
  [4, 2],
  [2, 4],
  [1, 4],
  [1, 3],
  [4, 2],
]

const BAR_TIME = 3000;
const CHECK_PERCENT = 0.1;
const BPM = 600;

const notes = [];
let musicTime = 0;
for (const note of music) {
  notes.push([musicTime / BPM * 60000, note[1]]);
  musicTime += note[0];
}

window.app = new Vue({
  el: "#app",
  data() {
    return {
      p: 0,
      tr: false,
      rp: 0,
      h: false,
      pm: true,
      mrs1: Infinity,
      sl: false,
      st: false,
      bt: 0,
      dim: [0,0,0],
      cdb: -1,
      bc: false,
      sc: false,
      mrs2: Infinity,
      nd: false,
      tm: 0,
      rd: -1,
      startFlower: Infinity,
      n: Date.now(),
      m: 0,
      ef: false,
      rd2: false,
      ff: new Array(24).fill(() => 0),
      clf: new Array(24).fill(0),
      todayDK: false,
      crt: getSecondsPassedToday(),
      ts: 1,
      dkShow: false,
      cachedDK: false,
      nextDayPrepare: [],
      frd,
      winCount: 0,
      continue3: 0,
      onDK: 0,
      nextHide: false,
      hide: false,
      lastHide: false,
      hard3: 0,
      playing: false,
      playStart: 0,
      notes,
      canvas: null,
      ctx: null
    }
  },
  computed: {
    btnText() {
      const b = "点数+1";
      if (!this.h) return b;
      else if (!this.sl) {
        if (this.pm) return b;
        return "点数-1";
      } else if (!this.st) return "点数+???";
    },
    styleObj() {
      if (this.st) return "display: none";
      if (this.tr && !this.sl) {
        return {
          position: "absolute",
          left: `${this.rp * 100}%`
        };
      }
    },
    time() {
      const x = this.tm / 1000;
      if (x < 60) return `${x.toFixed(0)}秒`;
      return `${Math.floor(x / 60).toFixed(0)}分${(x % 60).toFixed(0)}秒`;
    },
    flowerTime() {
      const diff = 30 - (this.n - this.startFlower) / 1000;
      return diff.toFixed(2);
    },
    timeout() {
      return 30 < (this.n - this.startFlower) / 1000;
    },
    dkTime() {
      return secondsToTimeStr(this.crt, this.hide);
    },
    onDKTime() {
      return secondsToTimeStr(this.onDK);
    },
    th() {
      return this.winCount >= 3 && this.continue3 >= 2 && this.hard3 >= 1;
    },
    pt() {
      return this.n - this.playStart;
    },
    vn() {
      return this.notes.filter(x => x[0] > this.pt - CHECK_PERCENT * BAR_TIME && x[0] < this.pt + (1 - CHECK_PERCENT) * BAR_TIME);
    }
  },
  methods: {
    update() {
      this.p = player.p;
      const e = player.e;
      this.tr = e.tr;
      this.h = e.h;
      this.sl = e.sl;
      this.st = e.st;
      this.bt = player.bt;
      this.bc = e.bc;
      this.sc = e.sc;
      this.nd = e.nd;
      this.ef = e.ef;
      this.rd2 = e.rd;
      const n = Date.now();
      this.tm = n - player.start;
      if (!this.th) this.crt += (n - this.n) / 1000 * this.ts;
      if (this.crt >= 86400) {
        this.crt -= 86400;
        if (!this.todayDK && this.continue3 < 2) this.continue3 = 0;
        this.todayDK = false;
        this.nextDayPrepare = new Array(frd.length).fill(0).map((x, i) => [i, Math.random() < 0.9 ? (2 * Math.pow(Math.random(), 1.2) + 0.1 + (Math.random() < 0.4 ? 1.1 : 0)) : 86401]).sort((a, b) => a[1] - b[1]);
        this.lastHide = this.hide;
        this.hide = this.nextHide;
      }
      this.n = n;
      if (!this.sl && n - this.mrs1 >= 3000) {
        e.sl = true;
      }
      if (this.st) {
        this.dim = player.dim.slice();
        this.cdb = player.cdb;
        if (this.bt > 0.9995 && !e.bc) {
          e.bc = true;
        }
      }
      if (!this.sc && n - this.mrs2 >= 3000) {
        e.sc = true;
      }
    },
    format(x) {
      return x.toFixed(0);
    },
    handle() {
      if (!player.e.tr) {
        player.p++;
        if (player.p >= 30) {
          player.e.tr = true;
        }
      } else if (!player.e.h) {
        player.p++;
        this.rp = Math.random();
        if (player.p >= 45 && Math.random() > 0.9) {
          player.e.h = true;
        }
      } else if (!this.sl) {
        if (this.pm) player.p++;
        else player.p--;
        this.rp = Math.random();
        this.pm = Math.random() > 0.5 || player.p === 0;
        if (!this.pm) this.mrs1 = Date.now();
        else this.mrs1 = Infinity;
      } else if (!this.st) {
        player.p = 2025;
        player.e.st = true;
      }
    },
    cb(x, y) {
      if (player.p < y) return;
      player.cdb = x;
      player.p -= y;
      player.dim[x] = 1;
    },
    su() {
      player.spd += 0.01;
      player.p--;
      player.p = Math.max(player.p, 0);
    },
    bigCrunch() {
      this.mrs2 = Date.now();
    },
    refreshGame() {
      document.body.classList.add("refresh");
      setTimeout(() => {
        document.body.classList.remove("refresh");
        player.e.nd = true;
        player.p = 0;
        player.bt = 0;
        player.dim = [0, 0, 0];
        player.cdb = -1;
        player.k = 0.999;
        player.bt = 0.001;
        this.rd = Math.floor(Math.random() * 24);
        this.m = (Math.random() > 0.5 ? 1 : -1) * (10 + 40 * Math.random());
        this.startFlower = Date.now();
      }, 5000);
    },
    rdStyle(id) {
      if (this.ef) {
        return { opacity: `${Math.max(0, 1 - this.clf[id] / 10) * 100}%` };
      }
      if (id === this.rd) {
        return { filter: `hue-rotate(${this.m}deg)` };
      }
      return "";
    },
    cf(id) {
      if (this.timeout && player.p < 100) {
        if (this.ef && this.clf[id] < 10) {
          const g = this.ff[id](player.p);
          player.p = Math.max(Math.min(g, 100), 0);
          if (player.p === 100) {
            const flowers = this.$refs.flowers;
            flowers.forEach(x => x.style.animationDuration = "0.8s");
            setTimeout(() => {
              player.e.rd = true;
              this.crt = getSecondsPassedToday();
            }, 2000);
          }
        }
        this.clf[id]++;
        return;
      };
      if (this.ef) return;
      if (id === this.rd) {
        player.p++;
      } else if (player.p > 0) {
        player.p--;
      }
      this.rd = Math.floor(Math.random() * 24);
      this.m = (Math.random() > 0.5 ? 1 : -1) * (20 + 80 * Math.random()) / Math.pow(player.p + 1, 0.1);
    },
    tryAgain() {
      this.rd = Math.floor(Math.random() * 24);
      this.m = (Math.random() > 0.5 ? 1 : -1) * (10 + 40 * Math.random());
      this.startFlower = Date.now();
      player.p = 0;
    },
    exploreFlower() {
      player.p -= 20;
      player.e.ef = true;
      this.ff[0] = (x => x + 1);
      for (let i = 1; i < 24; i++) {
        const rn = Math.random();
        if (rn < 0.05) this.ff[i] = (() => 0);
        else if (rn < 0) this.ff[i] = (x => Math.max(0,
        x - 1));
        else if (rn < 0.15) this.ff[i] = (x => Math.floor(x / 1.2));
        else if (rn < 0.2) this.ff[i] = (x => x + 1);
        else if (rn < 0.8) this.ff[i] = (x => x + 2);
        else if (rn < 0.9) this.ff[i] = (x => x + 3);
        else if (rn < 0.98) this.ff[i] = (x => x + 4);
        else this.ff[i] = (x => Math.floor(x * 1.1));
      }
    },
    modifyTimeSpeed(x) {
      this.ts = x;
    },
    openDK() {
      if (!this.dkShow) {
        setTimeout(() => {
          this.dkShow = true;
          this.cachedDK = this.todayDK;
        }, Math.random() * 500 + 100);
      } else {
        this.dkShow = false;
      }
    },
    dk() {
      this.todayDK = true;
      this.cachedDK = true;
      this.nextDayPrepare.push([-1, this.crt]);
      this.nextDayPrepare = this.nextDayPrepare.sort((a, b) => a[1] - b[1]);
      const i = this.nextDayPrepare.map(x => x[0]).indexOf(-1);
      if (i === 0) this.winCount++;
      if (i < 3) {
        this.continue3++;
        if (this.lastHide) this.hard3++;
      } else if (this.continue3 < 2) {
        this.continue3 = 0;
      }
      this.onDK = this.crt;
    },
    des(x) {
      if (x <= 2) return `今日第${x + 1}个打卡`;
      return "今日已打卡";
    },
    play() {
      if (this.playing) return;
      this.playing = true;
      this.playStart = Date.now() + 3000;
    },
    noteStyle(note) {
      return {
        left: `${100 * ((note[0] - this.pt) / BAR_TIME + CHECK_PERCENT)}%`,
        "background-color": ["#cc3333", "#33cc33", "#cccc33", "#3333cc"][note[1] - 1]
      };
    }
  }
});

function getSecondsPassedToday() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return Math.floor((now - startOfDay) / 1000);
}

function secondsToTimeStr(seconds, hideSec = false) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const pad = (num) => String(num).padStart(2, '0');
    if (hideSec) return `${pad(hours)}:${pad(minutes)}`;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function updateResource(diff) {
  if (player.e.st && !player.e.bc || player.e.nd) {
    for (let i = player.cdb; i > 0; i--) {
      player.dim[i - 1] += player.dim[i] * player.spd * (diff / 1000);
    }
    
    player.bt += Math.log(player.dim[0] * player.spd * 10 + 1) / 1000 * (player.bt) * (player.k - player.bt) / player.k;
  }
}

function gameLoop() {
  const diff = Date.now() - player.lastUpdate;
  player.lastUpdate += diff;
  updateResource(diff);
  for (let i = 0; i < updates.length; i++) {
    updates[i]();
  }
}

window.onload = function() {
  setInterval(() => gameLoop(), 33);
}


