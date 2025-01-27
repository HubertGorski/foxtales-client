<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { ROUTE_PATH } from '@/router/routeEnums';
import HubBtn from '@/components/hubComponents/HubBtn.vue';
import { Game } from '@/models/Game';
import { games } from '@/assets/data/games';

const router = useRouter();
const { t } = useI18n();

const actualGames: Game[] = games.filter(game => game.isPublic);

const customCode = ref<string>('');
const password = ref<string>('');
const selectedGameCode = ref<string>('');

const acceptCodeBtn = computed(() => {
  return {
    text: t("join"),
    isOrange: true,
    disabled: customCode.value.length === 0,
    action: () => router.push(ROUTE_PATH.LOBBY)
  };
});
const acceptPasswordBtn = computed(() => {
  return {
    text: t("join"),
    isOrange: true,
    disabled: password.value.length === 0,
    action: () => router.push(ROUTE_PATH.LOBBY)
  };
});

const backBtn = {
    id: 1,
    text: t("back2"),
    isOrange: false,
    action: () => router.push(ROUTE_PATH.MENU)
  };

const goToLobby = () => {
  router.push(ROUTE_PATH.LOBBY);
}
</script>

<template>
  <div class="joinGameView">
    <div v-if="selectedGameCode" @click="selectedGameCode = ''" class="mask"></div>
    <div :class="{isVisible: selectedGameCode}" class="joinGameView_gameDetailsPopup whiteCard">
      <p class="subtitle">Wymagane hasło dostępu</p>
      <v-text-field v-model="password" hide-details placeholder="Hasło" type="password"/>
      <HubBtn class="joinGamePerCode_btn" :action="acceptPasswordBtn.action" :text="acceptPasswordBtn.text" :isOrange="acceptPasswordBtn.isOrange" :disabled="acceptPasswordBtn.disabled"/>
    </div>
    <img src="@/assets/imgs/fox7.png" alt="Lisek" class="joinGameView_fox" />
    <div class="whiteCard">
        <p class="subtitle">Dołącz za pomocą kodu</p>
        <div class="joinGamePerCode">
          <v-text-field v-model="customCode" hide-details/>
          <HubBtn class="joinGamePerCode_btn" :action="acceptCodeBtn.action" :text="acceptCodeBtn.text" :isOrange="acceptCodeBtn.isOrange" :disabled="acceptCodeBtn.disabled"/>
        </div>
    </div>
    <div class="joinGameView_or">
      <v-divider/>
      <span>Lub</span>
      <v-divider/>
    </div>
    <div class="joinGameView_chooseRoom whiteCard">
        <p class="subtitle">Wybierz pokój z listy</p>
        <div v-if="actualGames.length === 0" class="emptyGamesList">
          <img src="@/assets/imgs/fox-icon.png" alt="Lisek" />
          <p>Brak publicznych pokoi</p>
        </div>
        <div v-else class="gamesList">
          <div @click="game.isPasswordSet ? selectedGameCode = game.code : goToLobby()" class="gamesList_game" v-for="game in actualGames" :key="game.code">
            <div class="name">
              {{ game.name }}
            </div>
            <v-divider/>
            <div class="details">
              <div v-if="game.password">
                <v-icon>mdi-lock</v-icon>
                <span>Wymagane hasło</span>
              </div>
              <div class="details_usersCount">
                <v-icon>mdi-account-multiple</v-icon>
                <span>{{ game.usersCount }} graczy w pokoju</span>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="joinGameView_controls">
      <HubBtn class="btn" :action="backBtn.action" :text="backBtn.text" :isOrange="backBtn.isOrange"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
.joinGameView {
  background: $mainBackground;
  padding: 46px 24px 24px 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  position: relative;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    z-index: 1;
    opacity: 0.2;
  }

  &_gameDetailsPopup {
    position: absolute;
    z-index: 2;
    width: 310px;
    display: flex;
    gap: 12px;
    transform: scale(0.00001);
    background-color: white;
    
    &.isVisible {
      transition: all 0.2s;
      transform: scale(1);
    }
  }

  &_fox {
    width: 120px;
    position: absolute;
    top: 0;
    right: 0;
  }

  &_controls {
    display: flex;
    width: 100%;
    gap: 12px;

    .btn {
      padding: 8px 12px;
      font-size: 16px;
    }
  }

  &_chooseAvatar {
    margin-bottom: 16px;
  }

  &_chooseRoom {
    flex-grow: 1;

    .emptyGamesList {
      padding-top: 18px;

      img {
        opacity: 0.2;
        width: 100%;
      }
      p {
        color: $mainBrownColor;
        font-weight: 600;
        text-align: center;
        width: 100%;
      }
    }

    .gamesList {
      overflow-y: scroll;
      height: 284px;

      &_game {
        background-color: white;
        border-radius: 12px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        margin: 8px 0;
        padding: 8px;
        
        .name {
          color: $grayColor;
          font-size: 16px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .v-divider {
          margin: 4px;
        }

        .details {
          font-size: 14px;
          font-style: italic; 
          color: $lightGrayColor;
          letter-spacing: 0.5px; 
          display: flex;
          flex-direction: column;
          gap: 4px;

          .v-icon {
            margin: 0 4px;
          }
        }
      }
    }
  }

  &_or {
    display: flex;
    align-items: center;
    width: 100%;
    .v-divider {
      width: 100%;
    }
    span {
      padding: 0 12px;
      color: $mainBrownColor;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .title {
      color: $grayColor;
      font-size: 24px;
      font-weight: 600;
      padding-bottom: 12px;
    }

  .subtitle {
      color: $grayColor;
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 12px;
    }

  .joinGamePerCode {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &_btn {
      padding: 6px;
      font-size: 18px;
      width: auto;
    }
  }

  .avatars {
    display: flex;
    justify-content: space-between;

    &_avatar {
      background-color: white;
      height: 56px;
      width: 56px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      border-radius: 50%;
    }
  }
}
</style>
