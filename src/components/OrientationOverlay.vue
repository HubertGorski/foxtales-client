<template>
  <div class="orientationOverlay">
    <p>{{ $t('rotateScreen') }}</p>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .orientationOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $darkBackground;
    color: $mainBrownColor;
    font-size: 24px;
    font-weight: 600;
    z-index: 9999;
    padding: 20px;
    text-align: center;
  }
</style>
