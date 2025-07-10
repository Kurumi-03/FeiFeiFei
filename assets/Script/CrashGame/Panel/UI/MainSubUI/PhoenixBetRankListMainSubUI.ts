import {
    _decorator,
    Component,
    instantiate,
    Node
} from 'cc';
import {
    CrashRankBetItemComponent
} from '../../Component/CrashRankBetItemComponent';
import {
    CrashMainUI
} from '../CrashMainUI';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import {
    PhoenixDataEvent
} from '../../../Event/PhoenixEvent';
const {
    ccclass,
    property
} = _decorator;

@ccclass('PhoenixBetRankListMainSubUI')
export class PhoenixBetRankListMainSubUI extends Component {
    mainUI: CrashMainUI;
    curRankBetItems: CrashRankBetItemComponent[] = [];

    rankBetItemDataList: any[] = [];
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }

    start() {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_BET_RANKING_LIST_BACK_EVENT.toString(), this.onRSPGetRankingListBackEvnt.bind(this));

    }

    onRSPGetRankingListBackEvnt(data) {
        this.updateBetRankItemsView(data);
    }
    updateBetRankItemsView(data) {
        for (let i = 0; i < data.List.length; i++) {
            let betResult = data.List[i];
            if (betResult.TotalBetAmount > 0) {
                this.addRankBetItem(betResult, i + 1);
            }
        }
    }

    addRankBetItem(betData, rankIndex) {
        if (rankIndex > 5) return;
        let objRankBetItem = null;
        let rankBetItemCom = null;
        if (this.curRankBetItems.length < rankIndex) {
            objRankBetItem = instantiate(this.mainUI.view.objRankBetItem)
            objRankBetItem.parent = this.mainUI.view.objRankBetItem.parent;
            objRankBetItem.active = true;

            rankBetItemCom = objRankBetItem.getComponent(CrashRankBetItemComponent);

            this.curRankBetItems.push(rankBetItemCom);
        } else {
            objRankBetItem = this.curRankBetItems[rankIndex - 1].node;
            rankBetItemCom = this.curRankBetItems[rankIndex - 1];

            objRankBetItem.active = true;
        }

        objRankBetItem.setSiblingIndex(rankIndex);

        rankBetItemCom.setBetInfo(betData, rankIndex);

        // rankBetItemCom.setAlreadyGetBack(betData.Multiplier);

        let items = objRankBetItem.parent.children;
        let index = 0
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.active) {
                let itemCom = item.getComponent(CrashRankBetItemComponent);
                itemCom.setRank(index);
                index++;
            }
        }
    }

    addRankBetItemData(betData) {
        let insertIndex = this.rankBetItemDataList.findIndex(item => item.BetInfo.Amount < betData.BetInfo.Amount);

        // 如果找到合适的位置，使用 splice 方法插入数据
        if (insertIndex !== -1) {
            this.rankBetItemDataList.splice(insertIndex, 0, betData);
        } else {
            // 如果没有找到合适的位置，说明新数据项的 money 是最小的，插入到数组末尾
            this.rankBetItemDataList.push(betData);
            insertIndex = this.rankBetItemDataList.length - 1;
        }
        return insertIndex;
    }

    cleanItems() {
        this.rankBetItemDataList = [];

        this.curRankBetItems.forEach((item) => {
            item.node.destroy();
        });
        this.curRankBetItems = [];
    }
}