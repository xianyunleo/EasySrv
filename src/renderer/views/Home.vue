<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
<!--        <a-button type="primary">一键启动</a-button>-->
<!--        <a-button type="primary">命令行终端</a-button>-->
        <a-button type="primary" @click="corePathClick">{{APP_NAME}}目录</a-button>
        <a-button type="primary" @click="wwwPathClick">网站目录</a-button>
      </div>
    </a-card>

    <a-table :columns="columns" :data-source="serverList" class="content-table" :pagination="false" size="middle">
      <template #bodyCell="{ column, record}">
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px;">
            <right-square-filled style="color: red;" v-show="!record.isRunning"/>
            <right-square-filled style="color: #20a53a;" v-show="record.isRunning"/>
          </div>
        </template>
        <template v-if="column.dataIndex === 'service'">
          <div>
            <a-switch @click="serviceChange" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary" @click="startServerClick(record)" v-show="!record.isRunning">启动</a-button>
            <a-button type="primary" @click="stopServerClick(record)" v-show="record.isRunning">停止</a-button>
            <a-button type="primary" @click="restartServerClick(record)">重启</a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu >
                  <a-menu-item @click="openInstallPath(record)">打开所在目录</a-menu-item>
                  <a-menu-item v-if="record.ServerConfPath" @click="openConfFile(record)">打开配置文件</a-menu-item>
                  <a-menu-item v-for="(item,i) in record.ExtraFiles" :key="i" @click="openExtraFile(record,item)">
                    打开{{item.Name}}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                管理
                <DownOutlined/>
              </a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>

    <a-card title="服务运行日志" class="log-card">
      下个版本开放！！！
<!--      <div>-->
<!--        2022-06-04 15:39:57 [Nginx] 启动成功<br>-->
<!--        2022-06-04 19:39:57 [Nginx] 关闭成功-->
<!--      </div>-->
    </a-card>
  </div>
  <user-pwd-modal v-model:show="userPwdModalShow" :cancel-is-exit="true" />
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, watch} from 'vue';
import {useMainStore} from '@/renderer/store'
import {DownOutlined, RightSquareFilled} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import App from "@/main/App";
import GetPath from "@/shared/utils/GetPath";
import Software from "@/main/core/software/Software";
import ServerControl from "@/main/core/ServerControl";
import MessageBox from "@/renderer/utils/MessageBox";
import {storeToRefs} from "pinia/dist/pinia";
import {APP_NAME} from "@/shared/constant";
import Native from "@/renderer/utils/Native";
//import {sleep} from "@/shared/utils/utils";
import Path from "@/main/utils/Path";
import ProcessExtend from "@/main/core/ProcessExtend";
import UserPwdModal from "@/renderer/components/UserPwdModal";
import SettingsExtend from "@/main/core/SettingsExtend";

const userPwdModalShow = ref(false);
if (!SettingsExtend.isUserPwdSet()) {
  userPwdModalShow.value = true;
}

const columns = [
  {
    title: '服务名',
    width: 180,
    dataIndex: 'Name',
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'operate',
    align: 'center',
  }
];

const mainStore = useMainStore();
const {serverSoftwareList} = storeToRefs(mainStore);

let serverList = serverSoftwareList.value.filter(item => Software.IsInstalled(item));

const refreshServerStatus = async () => {
  let processList = await ProcessExtend.getList({directory: GetPath.getSoftwarePath()});
  let pathList = processList.map(item => item.path);
  for (const item of serverList) {
    let processPath = Software.getServerProcessPath(item);
    item.isRunning = pathList.includes(processPath);
  }
};

refreshServerStatus();

const serviceChange = ()=>{
  message.info('下个版本开放！！！');
}

const corePathClick = ()=>{
  Native.openPath(App.getUserCorePath());
}
const wwwPathClick = ()=>{
  Native.openPath(GetPath.getWebsitePath());
}

const openInstallPath = (item) => {
  Native.openPath(Software.getPath(item));
}

const openConfFile = (item) => {
  Native.openTextFile(Software.getServerConfPath(item));
}

const openExtraFile = (item, extraFile) => {
  Native.openTextFile(Path.Join(Software.getPath(item), extraFile.Path));
}

const startServerClick = async (item) => {
  try {
    //todo 开始前loading，开始后sleep 1-3s
    await ServerControl.start(item);
    if (!item.unwatch) {
      item.unwatch = watch(() => item.errMsg, (errMsg) => {
        if (errMsg) {
          MessageBox.error(errMsg, '启动服务出错！');
        }
      });
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！');
  }
}

const restartServerClick = async (item) => {
  try {
    //todo 开始前loading，开始后sleep 1-3s
    await ServerControl.stop(item);
    if (item.isRunning) {
      MessageBox.error('服务没有成功停止！', '重启服务出错！');
      return;
    }
    await ServerControl.start(item);
  } catch (error) {
    MessageBox.error(error.message ?? error, '重启服务出错！');
  }
}

const stopServerClick = async (item) => {
  try {
    await ServerControl.stop(item);
    await refreshServerStatus();
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！');
  }
}

</script>

<style scoped lang="scss">
.quick-card {
  margin-top: 10px;
}

.quick-card-content {
  display: flex;
  justify-content: space-around
}

.log-card {
  margin-bottom: 10px;

  :deep(.ant-card-body) {
    height: 150px;
    padding: 12px 24px;
  }
}

.operate-td {
  display: flex;
  justify-content: space-evenly;
}



</style>
