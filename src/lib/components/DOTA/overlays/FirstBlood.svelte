<script>
import { asset } from "$app/paths";
    let {show_firstblood, drawer} = $props()
</script>
<div class="card px-2" class:active={show_firstblood} >
  <div class="text">{drawer} drew the First BLOOD !!!</div>
  <div class="splash relative z-5 "><img src={asset('/resources/image_style/splash_mask.png')} alt="splash" class="h-12"/></div>
</div>

<style>
/* ================= BANNER ================= */

.card{
  width:700px;
  height:50px;
  border-radius:12px;
  background:linear-gradient(to right,#140000,#2a0000,#140000);
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow:hidden;
  opacity:0;
}

/* ================= TEXT ================= */

.text{
  font-family:'Cinzel', serif;
  font-size:20px;
  font-weight:900;
  letter-spacing:4px;
  white-space:nowrap;
  z-index:2;

  background:linear-gradient(
    to bottom,
    #fff3c4 0%,
    #ffd76b 40%,
    #ffb300 65%,
    #e08a00 100%
  );
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;

  text-shadow:
    0 2px 0 #830606,
    0 4px 8px rgba(60, 8, 8, 0.9),
    0 0 25px rgba(231, 131, 10, 0.6);
}

/* ================= BLOOD FLASH ================= */

.card::before{
  content:"";
  position:absolute;
  inset:0;
  background:radial-gradient(circle,
    rgba(180,0,0,.8) 0%,
    rgba(90,0,0,.6) 40%,
    transparent 75%);
  opacity:0;
}

.card::after{
  content:"";
  position:absolute;
  top:50%;
  left:-120%;
  width:140%;
  height:8px;
  background:linear-gradient(
    90deg,
    transparent,
    #7a0000,
    #ff2a2a,
    #7a0000,
    transparent
  );
  transform:rotate(-18deg);
  opacity:0;
  filter:blur(1px);
}

/* ================= PLAY STATE ================= */

.card.active{
  animation:fadeSequence 6s ease-out forwards;
}

.card.active::before{
  animation:flash .7s ease;
}

.card.active::after{
  animation:slash .7s ease;
}

.splash {
  /* This specific combination shifts black toward red */
  filter: invert(16%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(95%) contrast(118%);
}

/* ================= KEYFRAMES ================= */

@keyframes fadeSequence{
  0%{ opacity:0; transform:scale(.9); }
  15%{ opacity:1; transform:scale(1); }
  70%{ opacity:1; }
  100%{ opacity:0; transform:scale(.95); }
}

@keyframes flash{
  0%{ opacity:0; }
  30%{ opacity:1; }
  100%{ opacity:0; }
}

@keyframes slash{
  0%{ left:-120%; opacity:0; }
  30%{ opacity:1; }
  100%{ left:140%; opacity:0; }
}
</style>