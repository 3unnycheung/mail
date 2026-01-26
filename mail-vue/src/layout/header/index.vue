<template>
  <div class="header" :class="!hasPerm('email:send') ? 'not-send' : ''">
    <div class="header-btn">
      <hanburger @click="changeAside"></hanburger>
      <span class="breadcrumb-item">{{ $t(route.meta.title) }}</span>
    </div>
    <div v-perm="'email:send'" class="writer-box" @click="openSend">
      <div class="writer">
        <Icon icon="material-symbols:edit-outline-sharp" width="22" height="22"/>
      </div>
    </div>
    <div class="toolbar">
      <div v-if="uiStore.dark" class="sun-icon icon-item" @click="openDark($event)">
        <Icon icon="mingcute:sun-fill"/>
      </div>
      <div v-else class="dark-icon icon-item" @click="openDark($event)">
        <Icon icon="solar:moon-linear"/>
      </div>
      <div class="notice icon-item" @click="openNotice">
        <Icon icon="streamline-plump:announcement-megaphone"/>
      </div>
      <el-dropdown ref="userinfoRef" @visible-change="e => userInfoShow = e" :teleported="false" popper-class="detail-dropdown">
        <div class="avatar" @click="userInfoHide" >
          <div class="avatar-text">
            <div>{{ formatName(userStore.user.email) }}</div>
          </div>
          <Icon class="setting-icon" icon="mingcute:down-small-fill" width="24" height="24"/>
        </div>
        <template #dropdown>
          <div class="user-details">
            <div class="details-avatar">
              {{ formatName(userStore.user.email) }}
            </div>
            <div class="user-name">
              {{ userStore.user.name }}
            </div>
            <div class="detail-email" @click="copyEmail(userStore.user.email)">
              {{ userStore.user.email }}
            </div>
            <div class="detail-user-type">
              <el-tag>{{ userStore.user.role.name }}</el-tag>
            </div>
            <div class="action-info">
              <div>
                <span style="margin-right: 10px">{{ $t('sendCount') }}</span>
                <span style="margin-right: 10px">{{ $t('accountCount') }}</span>
              </div>
              <div>
                <div>
                  <span v-if="sendCount" style="margin-right: 5px">{{ sendCount }}</span>
                  <el-tag v-if="!hasPerm('email:send')">{{ sendType }}</el-tag>
                  <el-tag v-else>{{ sendType }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="settingStore.settings.manyEmail || settingStore.settings.addEmail">
                    {{ $t('disabled') }}
                  </el-tag>
                  <span v-else-if="accountCount && hasPerm('account:add')"
                        style="margin-right: 5px">{{ $t('totalUserAccount', {msg: accountCount}) }}</span>
                  <el-tag v-else-if="!accountCount && hasPerm('account:add')">{{ $t('unlimited') }}</el-tag>
                  <el-tag v-else-if="!hasPerm('account:add')">{{ $t('unauthorized') }}</el-tag>
                </div>
              </div>
            </div>
            <div class="logout">
              <el-button type="primary" :loading="logoutLoading" @click="clickLogout">{{ $t('logOut') }}</el-button>
            </div>
          </div>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import hanburger from '@/components/hamburger/index.vue'
import {logout} from "@/request/login.js";
import {Icon} from "@iconify/vue";
import {useUiStore} from "@/store/ui.js";
import {useUserStore} from "@/store/user.js";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";
import {useSettingStore} from "@/store/setting.js";
import {hasPerm} from "@/perm/perm.js"
import {useI18n} from "vue-i18n";
import {setExtend} from "@/utils/day.js"

const {t} = useI18n();
const route = useRoute();
const settingStore = useSettingStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const logoutLoading = ref(false)
const userInfoShow = ref(false)
const userinfoRef = ref({})

const accountCount = computed(() => {
  return userStore.user.role.accountCount
})

const sendType = computed(() => {

  if (settingStore.settings.send === 1) {
    return t('disabled')
  }

  if (!hasPerm('email:send')) {
    return t('unauthorized')
  }

  if (userStore.user.role.sendType === 'ban') {
    return t('sendBanned')
  }

  if (!userStore.user.role.sendCount) {
    return t('unlimited')
  }

  if (userStore.user.role.sendType === 'day') {
    return t('daily')
  }

  if (userStore.user.role.sendType === 'count') {
    return t('total')
  }
})

const sendCount = computed(() => {


  if (!hasPerm('email:send')) {
    return null
  }

  if (userStore.user.role.sendType === 'ban') {
    return null
  }

  if (!userStore.user.role.sendCount) {
    return null
  }

  if (settingStore.settings.send === 1) {
    return null
  }

  return userStore.user.sendCount + '/' + userStore.user.role.sendCount
})

function userInfoHide(e) {
    if (userInfoShow.value) {
        userinfoRef.value.handleClose()
    } else {
        userinfoRef.value.handleOpen()
    }
}

async function copyEmail(email) {
  try {
    await navigator.clipboard.writeText(email);
    ElMessage({
      message: t('copySuccessMsg'),
      type: 'success',
      plain: true,
    })
  } catch (err) {
    console.error(`${t('copyFailMsg')}:`, err);
    ElMessage({
      message: t('copyFailMsg'),
      type: 'error',
      plain: true,
    })
  }
}

function changeLang(lang) {
  setExtend(lang === 'en' ? 'en' : 'zh-cn')
  settingStore.lang = lang
}

function openNotice() {
  uiStore.showNotice()
}

function openDark(e) {

  const nextIsDark = !uiStore.dark
  const root = document.documentElement

  if (!document.startViewTransition) {
    switchDark(nextIsDark, root);
    return
  }

  const x = e.clientX
  const y = e.clientY

  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  const endRadius = Math.hypot(maxX, maxY)

  // 标记切换目标，供 CSS 选择器使用
  root.setAttribute('data-theme-to', nextIsDark ? 'dark' : 'light')
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-end-radius', `${endRadius + 10}px`)

  const transition = document.startViewTransition(() => {
    switchDark(nextIsDark, root);
  })

  transition.finished.finally(() => {
    // 清理标记
    root.removeAttribute('data-theme-to')
  })
}

function switchDark(nextIsDark, root) {
  root.setAttribute('class', nextIsDark ? 'dark' : '')
  const metaTag = document.getElementById('theme-color-meta');
  const isMobile =  !window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  metaTag.setAttribute('content', nextIsDark ? (isMobile ? '#141414' : '#000000') : (isMobile ? '#FFFFFF' : '#F1F1F1'));
  uiStore.dark = nextIsDark
}

function openSend() {
  uiStore.writerRef.open()
}

function changeAside() {
  uiStore.asideShow = !uiStore.asideShow
}

function clickLogout() {
  logoutLoading.value = true
  logout().then(() => {
    localStorage.removeItem("token")
    router.replace('/login')
  }).finally(() => {
    logoutLoading.value = false
  })
}

function formatName(email) {
  return email[0]?.toUpperCase() || ''
}

</script>
<style>
.detail-dropdown {
  color: var(--el-text-color-primary) !important;
}
</style>
<style lang="scss" scoped>

:deep(.el-popper.is-pure) {
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-2);
  border: none;
}

.user-details {
  width: 260px;
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  padding: 8px 0;

  .user-name {
    font-weight: 500;
    margin-top: 12px;
    padding-left: 20px;
    padding-right: 20px;
    width: 260px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    font-size: 15px;
  }

  .detail-user-type {
    margin-top: 12px;
  }

  .action-info {
    width: 100%;
    display: grid;
    grid-template-columns: auto auto;
    margin-top: 12px;
    padding: 0 12px;

    > div:first-child {
      display: grid;
      align-items: center;
      gap: 12px;
    }

    > div:last-child {
      display: grid;
      gap: 12px;
      text-align: center;

      > div {
        display: flex;
        align-items: center;
      }
    }
  }

  .detail-email {
    padding-left: 20px;
    padding-right: 20px;
    width: 260px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    color: var(--regular-text-color);
    cursor: pointer;
    font-size: 13px;
    margin-top: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .logout {
    margin-top: 20px;
    width: 100%;
    padding: 0 12px 12px;

    .el-button {
      border-radius: var(--radius-md);
      height: 36px;
      width: 100%;
      font-weight: 500;
    }
  }

  .details-avatar {
    margin-top: 20px;
    height: 48px;
    width: 48px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border: none;
    font-size: 20px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
  }
}


.header {
  text-align: right;
  font-size: 12px;
  display: grid;
  height: 100%;
  gap: 12px;
  grid-template-columns: auto auto 1fr;
  padding: 0 8px;
}

.header.not-send {
  grid-template-columns: auto 1fr;
}

.writer-box {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  .writer {
    width: 56px;
    height: 40px;
    border-radius: var(--radius-full);
    color: #ffffff;
    background: var(--el-color-primary);
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    box-shadow: var(--elevation-1);
    
    &:hover {
      background: var(--el-color-primary-dark-2);
      box-shadow: var(--elevation-2);
      transform: translateY(-1px);
    }

    .writer-text {
      margin-left: 15px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.header-btn {
  display: inline-flex;
  align-items: center;
  height: 100%;
  min-width: 0;
  gap: 12px;
}

.breadcrumb-item {
  font-weight: 500;
  font-size: 22px;
  color: var(--el-text-color-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  letter-spacing: -0.5px;
}

.toolbar {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
  @media (max-width: 767px) {
    gap: 2px;
  }

  .icon-item {
    align-self: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .icon-item:hover {
    background: var(--base-fill);
  }

  .notice {
    font-size: 22px;
  }

  .dark-icon {
    font-size: 20px;
  }

  .sun-icon {
    font-size: 24px;
  }

  .avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 4px;
    padding: 4px 8px 4px 4px;
    border-radius: var(--radius-full);
    transition: background var(--transition-fast);
    
    &:hover {
      background: var(--base-fill);
    }

    .avatar-text {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      height: 32px;
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: var(--radius-full);
      border: none;
      font-weight: 500;
      font-size: 14px;
    }

    .setting-icon {
      position: relative;
      top: 0;
      margin-right: 4px;
      bottom: 10px;
      color: var(--secondary-text-color);
    }
  }

}

.el-tooltip__trigger:first-child:focus-visible {
  outline: unset;
}
</style>
