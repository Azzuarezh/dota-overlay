<script>
  import {asset} from '$app/paths'
    import e from 'cors';
     let {radiant_team_info, dire_team_info, radiant_win_probability = 50} = $props(); // pass this as parameter (0–100)


    // clamp 0–100
    const safeRadiantWinProbability = $derived(Math.max(0, Math.min(100, radiant_win_probability))
    );

    const direWinProbability = $derived(100 - safeRadiantWinProbability);
    const radiantLeading = $derived(safeRadiantWinProbability >= direWinProbability);
</script>

<div class="win-container">
  <div class="header">
    <div class="team left">
      <img src={radiant_team_info.logo} 
      alt="Radiant Team" class="p-2"
      onerror={(e) => e.target.src = asset('/resources/image_style/default_team_logo.png')} 
      />
      <span class="radiant">{radiant_team_info.name}</span>
    </div>

    <div class="title">WIN PROBABILITY</div>

    <div class="team right">
      <span class="dire">{dire_team_info.name}</span>
      <img src={radiant_team_info.logo} 
       alt="Dire Team" class="p-2" 
        onerror={(e) => e.target.src = asset('/resources/image_style/default_team_logo.png')} />
    </div>
  </div>

  <div class="percent-text">
    {Math.round(safeRadiantWinProbability)}% - {Math.round(direWinProbability)}%
  </div>

  <div class="beam-wrapper">
    <div class="beam"></div>

    <div
      class="core"
      style="left: {safeRadiantWinProbability}%;"
      class:radiant-glow={radiantLeading}
      class:dire-glow={!radiantLeading}
    ></div>
  </div>
</div>

<style>
  .win-container {
    width: 700px;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(145deg, #2a2a33, #15151b);
    border: 3px solid #444;
    box-shadow:
      inset 0 0 10px rgba(255,255,255,.05),
      0 0 20px rgba(0,0,0,.8);
    color: white;
    font-family: Verdana, sans-serif;
    opacity:.8;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .team {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .team img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: fit;
    border: 2px solid #555;
  }

  .radiant {  font-weight: 800; font-family: 'radiance'; font-size: 1.5em; }
  .dire {  font-weight: 800; font-family: 'radiance'; font-size: 1.5em; }

  .title {
    font-weight: bold;
    letter-spacing: 3px;
    font-size: 18px;
    text-transform: uppercase;
    color: #d1faff;
  }

  .percent-text {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .beam-wrapper {
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
  }

  .beam {
    width: 100%;
    height: 6px;
    background: linear-gradient(to right, #1faa59, #555, #a61f1f);
    border-radius: 4px;
  }

  .core {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: left .6s ease, box-shadow .4s ease, background .4s ease;
  }

  .radiant-glow {
    background: #46ff88;
    box-shadow:
      0 0 15px #46ff88,
      0 0 35px #46ff88;
  }

  .dire-glow {
    background: #ff4d4d;
    box-shadow:
      0 0 15px #ff4d4d,
      0 0 35px #ff4d4d;
  }
</style>