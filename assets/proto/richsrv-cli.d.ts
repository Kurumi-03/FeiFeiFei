export declare class WebSocketConnectorOptions {
  onMessage?: ((type: string, payload: Uint8Array) => void) | null;
  onClose?: (() => void) | null;
}

export declare class WebSocketChannel {
  sendMessage: (type: string, payload: any) => void;
  sendRequest: (type: string, payload: any) => Promise<Uint8Array>;
  close: () => void;
  isSocketConnected: () => boolean;
}

export declare class MessageResponseException {
  readonly message: string;
  readonly stackTrace: string;
  readonly errorCode: number;
}

export declare namespace WebSocketConnector {
  function connect(url: string, options?: WebSocketConnectorOptions | null): Promise<WebSocketChannel>;
}

export declare namespace BaccaratProtocol {
  class AskPlayersBetState {
    NewCard: number;
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static Seat = class {
      Id: number;
      TotalBet: number;
      AreaCredits: InstanceType<typeof BaccaratProtocol.BetTimeSyncPoint.AreaCredit>[];
      IsAuto: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.BetTimeSyncPoint.Seat> };
    EachAreaBet: number[];
    EachAreaSelfBet: number[];
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
  class AutoBetHistoryRequest {
    TableToken: string;
  }
  class AutoBetHistoryResponse {
    constructor(data: Uint8Array);
  }
  class AutoBetHistoryReceipt {
    static AutoBetHistory = class {
      AutoMode: number;
      Times: number;
      TotalBet: number;
      Win: number;
      BetTime: string;
      Status: number;
    };
    HistoryList: InstanceType<typeof BaccaratProtocol.AutoBetHistoryReceipt.AutoBetHistory>[];
    constructor(data: Uint8Array);
  }
  class AutoBetMode1Request {
    TableToken: string;
    Start: number;
    BetTarget: number;
    BetAmount: number;
    BetRouns: number;
    Profit: number;
    Loss: number;
  }
  class AutoBetMode1Response {
    constructor(data: Uint8Array);
  }
  class AutoBetMode1Receipt {
    State: number;
    StopReason: number;
    constructor(data: Uint8Array);
  }
  class AutoBetMode2Request {
    TableToken: string;
    Start: number;
    Profit: number;
    Loss: number;
    MaxRouns: number;
    IsContinueTie: boolean;
    IsContinueLimit: boolean;
    BetTargets: number[];
    BetAmounts: number[];
    MatchRoad: { [key: number]: BaccaratProtocol.RoadMapList };
  }
  class AutoBetMode2Response {
    constructor(data: Uint8Array);
  }
  class AutoBetMode2Receipt {
    State: number;
    StopReason: number;
    constructor(data: Uint8Array);
  }
  class RoadMapList {
    Ball: number[];
    constructor(data: Uint8Array);
  }
  class AutoBetMode3Request {
    TableToken: string;
    Start: number;
    Profit: number;
    Loss: number;
    MaxRouns: number;
    Mutiple: number;
    IsContinueTie: boolean;
    IsContinueLimit: boolean;
    BetTargets: number[];
    BetAmounts: number[];
    MatchRoad: { [key: number]: BaccaratProtocol.RoadMapList };
  }
  class AutoBetMode3Response {
    constructor(data: Uint8Array);
  }
  class AutoBetMode3Receipt {
    State: number;
    StopReason: number;
    constructor(data: Uint8Array);
  }
  class AutoBetModeEnterGame1Receipt {
    BetTarget: number;
    BetAmount: number;
    BetRouns: number;
    Profit: number;
    Loss: number;
    RounsLeft: number;
    constructor(data: Uint8Array);
  }
  class AutoBetModeEnterGame2Receipt {
    Profit: number;
    Loss: number;
    MaxRouns: number;
    IsContinueTie: boolean;
    IsContinueLimit: boolean;
    BetTargets: number[];
    BetAmounts: number[];
    MatchRoad: { [key: number]: BaccaratProtocol.RoadMapList };
    RounsLeft: number;
    constructor(data: Uint8Array);
  }
  class AutoBetModeEnterGame3Receipt {
    Profit: number;
    Loss: number;
    MaxRouns: number;
    Mutiple: number;
    IsContinueTie: boolean;
    IsContinueLimit: boolean;
    BetTargets: number[];
    BetAmounts: number[];
    MatchRoad: { [key: number]: BaccaratProtocol.RoadMapList };
    RounsLeft: number;
    constructor(data: Uint8Array);
  }
  class DealAllCardsState {
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    BetLimit: number[];
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class GameBalanceState {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static SeatInfo = class {
      GPoint: number;
      BetPt: number;
      WinPt: number;
      CreditBackB: number;
      CreditBackP: number;
      EachAreaWinPt: number[];
      AreaCredits: InstanceType<typeof BaccaratProtocol.GameBalanceState.AreaCredit>[];
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.GameBalanceState.SeatInfo> };
    PlayerCardPoint: number;
    BankerCardPoint: number;
    WinType: number;
    PairType: number[];
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class GameBalanceSyncPoint {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static SeatInfo = class {
      GPoint: number;
      BetPt: number;
      WinPt: number;
      CreditBackB: number;
      CreditBackP: number;
      EachAreaWinPt: number[];
      AreaCredits: InstanceType<typeof BaccaratProtocol.GameBalanceSyncPoint.AreaCredit>[];
      IsAuto: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.GameBalanceSyncPoint.SeatInfo> };
    PlayerCardList: number[];
    PlayerCardPoint: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    WinType: number;
    PairType: number[];
    EachAreaBet: number[];
    EachAreaSelfBet: number[];
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class OpenCardAct1State {
    PlayerCardList: number[];
    PlayerCardPoint: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    constructor(data: Uint8Array);
  }
  class OpenCardAct1SyncPoint {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static Seat = class {
      Id: number;
      TotalBet: number;
      AreaCredits: InstanceType<typeof BaccaratProtocol.OpenCardAct1SyncPoint.AreaCredit>[];
      IsAuto: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.OpenCardAct1SyncPoint.Seat> };
    EachAreaBet: number[];
    PlayerCardList: number[];
    PlayerCardPoint: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    EachAreaSelfBet: number[];
    constructor(data: Uint8Array);
  }
  class OpenCardAct2State {
    PlayerHitCard: number;
    PlayerCardList: number[];
    PlayerCardPoint: number;
    constructor(data: Uint8Array);
  }
  class OpenCardAct2SyncPoint {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static Seat = class {
      Id: number;
      TotalBet: number;
      AreaCredits: InstanceType<typeof BaccaratProtocol.OpenCardAct2SyncPoint.AreaCredit>[];
      IsAuto: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.OpenCardAct2SyncPoint.Seat> };
    EachAreaBet: number[];
    PlayerCardList: number[];
    PlayerCardPoint: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    EachAreaSelfBet: number[];
    constructor(data: Uint8Array);
  }
  class OpenCardAct3State {
    BankerHitCard: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    constructor(data: Uint8Array);
  }
  class OpenCardAct3SyncPoint {
    static AreaCredit = class {
      Id: number;
      AllCredits: number[];
    };
    static Seat = class {
      Id: number;
      TotalBet: number;
      AreaCredits: InstanceType<typeof BaccaratProtocol.OpenCardAct3SyncPoint.AreaCredit>[];
      IsAuto: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.OpenCardAct3SyncPoint.Seat> };
    EachAreaBet: number[];
    PlayerCardList: number[];
    PlayerCardPoint: number;
    BankerCardList: number[];
    BankerCardPoint: number;
    EachAreaSelfBet: number[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    static AreaCredits = class {
      Credits0: number[];
      Credits1: number[];
      Credits2: number[];
      Credits3: number[];
      Credits4: number[];
    };
    TableToken: string;
    SeatId: number;
    BetAmounts: number[];
    Credits: InstanceType<typeof BaccaratProtocol.PlaceBetRequest.AreaCredits>;
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    static AreaCredits = class {
      Credits: number[];
    };
    SeatId: number;
    BetAmounts: number[];
    AllCredits: { [key: number]: InstanceType<typeof BaccaratProtocol.PlaceBetReceipt.AreaCredits> };
    GamePoints: number;
    TotalBet: number;
    FailReason: number;
    IsAuto: boolean;
    EachAreaBet: number[];
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
  class PlayersLeaveReceipt {
    constructor(data: Uint8Array);
  }
  class RoadInfoRequest {
    TableToken: string;
  }
  class RoadInfoResponse {
    constructor(data: Uint8Array);
  }
  class RoadInfoReceipt {
    static ColumnList = class {
      Ball: number[];
    };
    BallRoad: number[];
    BigRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    BigEyeRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    SmallRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    StrongRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadPBigRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadPBigEyeRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadPSmallRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadPStrongRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadBBigRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadBBigEyeRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadBSmallRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    AskRoadBStrongRoad: { [key: number]: InstanceType<typeof BaccaratProtocol.RoadInfoReceipt.ColumnList> };
    BankerCnts: number;
    PlayerCnts: number;
    TieCnts: number;
    BankerPairCnts: number;
    PlayerPairCnts: number;
    TableToken: string;
    constructor(data: Uint8Array);
  }
  class SeatInfoRequest {
    TableToken: string;
  }
  class SeatInfoResponse {
    constructor(data: Uint8Array);
  }
  class SeatInfoReceipt {
    static SeatInfo = class {
      HeadId: string;
      Nickname: string;
      TotalBet: number;
      MaxBet: number;
      MinBet: number;
      GamePoint: number;
      PlayerId: number;
    };
    Seats: { [key: number]: InstanceType<typeof BaccaratProtocol.SeatInfoReceipt.SeatInfo> };
    constructor(data: Uint8Array);
  }
  class SitDownRequest {
    TableToken: string;
    SeatId: number;
  }
  class SitDownResponse {
    constructor(data: Uint8Array);
  }
  class SitDownReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class StandUpRequest {
    TableToken: string;
    SeatId: number;
  }
  class StandUpResponse {
    constructor(data: Uint8Array);
  }
  class StandUpReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class TableInfoRequest {
    TableToken: string;
  }
  class TableInfoResponse {
    constructor(data: Uint8Array);
  }
  class TableInfoReceipt {
    GameSerNum: string;
    MinBet: number;
    CardLeftCnts: number;
    AutoRounsLeft: number;
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
}

export declare namespace ConnectorProtocol {
  class PingMessage {
    Key: number;
    constructor(data?: Uint8Array);
  }
  class PongMessage {
    Key: number;
    Seconds: number;
    constructor(data?: Uint8Array);
  }
}

export declare namespace GameLobbyProtocol {
  class ApiGameGetGameListRequest {
    APiGameId: string;
  }
  class ApiGameGetGameListResponse {
    constructor(data: Uint8Array);
  }
  class ApiGameGetGameListReceipt {
    static ApiGameData = class {
      Name: string;
      GameListId: string;
      ImgUrl: string;
    };
    APiGameId: string;
    State: number;
    ApiGameDatas: InstanceType<typeof GameLobbyProtocol.ApiGameGetGameListReceipt.ApiGameData>[];
    constructor(data: Uint8Array);
  }
  class ApiGameLoginRequest {
    APiGameId: string;
    APiGameListId: string;
  }
  class ApiGameLoginResponse {
    constructor(data: Uint8Array);
  }
  class ApiGameLoginReceipt {
    APiGameId: string;
    APiGameListId: string;
    State: number;
    Url: string;
    constructor(data: Uint8Array);
  }
  class ApiGameRecordDetailRequest {
    APiGameId: string;
    StartTime: number;
    EndTime: number;
    PageNo: number;
    PageSize: number;
  }
  class ApiGameRecordDetailResponse {
    constructor(data: Uint8Array);
  }
  class ApiGameRecordDetailReceipt {
    static ApiGameRecordDetail = class {
      No: string;
      BetTime: number;
      BetTimeStr: string;
      SubGameName: string;
      BetMoney: number;
      WinLose: number;
      Water: number;
      Status: number;
      StatusStr: string;
    };
    State: number;
    APiGameId: string;
    TotalPages: number;
    ApiGameRecords: InstanceType<typeof GameLobbyProtocol.ApiGameRecordDetailReceipt.ApiGameRecordDetail>[];
    constructor(data: Uint8Array);
  }
  class ApiGameRecordTotalRequest {
    StartTime: number;
    EndTime: number;
  }
  class ApiGameRecordTotalResponse {
    constructor(data: Uint8Array);
  }
  class ApiGameRecordTotalReceipt {
    static ApiGameRecordTotal = class {
      Name: string;
      GameListId: string;
      BetCount: number;
      BetMoney: number;
      WinLose: number;
      Water: number;
    };
    State: number;
    ApiGameTotalRecords: InstanceType<typeof GameLobbyProtocol.ApiGameRecordTotalReceipt.ApiGameRecordTotal>[];
    constructor(data: Uint8Array);
  }
  class BackFromAPIGameRequest {
    APiGameId: string;
    APiGameListId: string;
    ClubId: string;
  }
  class BackFromAPIGameResponse {
    constructor(data: Uint8Array);
  }
  class BackFromAPIGameReceipt {
    St: number;
    GamePoint: number;
    constructor(data: Uint8Array);
  }
  class BackFromGameRequest {
    Tabletoken: string;
  }
  class BackFromGameResponse {
    constructor(data: Uint8Array);
  }
  class BackFromGameReceipt {
    St: number;
    constructor(data: Uint8Array);
  }
  class CancelClubAgentRequest {
    ToMemberId: number;
    ClubId: string;
  }
  class CancelClubAgentResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ChangeClubMemberUserAgentReceipt {
    ClubId: string;
    UserAgent: number;
    constructor(data: Uint8Array);
  }
  class CliMateGameRequest {
    gamename: string;
    paramindex: number;
    tabletype: number;
    Roomtoken: string;
  }
  class CliMateGameResponse {
    state: number;
    srvname: string;
    Roomtoken: string;
    RoomKey: string;
    MaintenanceInfo: string;
    constructor(data: Uint8Array);
  }
  class CliReJoinGameRequest {
    TableToken: string;
    ClubId: string;
  }
  class CliReJoinGameResponse {
    State: number;
    GameName: string;
    Srvname: string;
    constructor(data: Uint8Array);
  }
  class ClubAddFromShareCodeRequest {
    ShareCode: string;
  }
  class ClubAddFromShareCodeResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ClubAgentGiveMoneyRequest {
    TakeOverId: number;
    ClubId: string;
    Money: number;
  }
  class ClubAgentGiveMoneyResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ClubAgentKickDownLineMemberRequest {
    KickId: number;
    ClubId: string;
  }
  class ClubAgentKickDownLineMemberResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ClubAgentKickDownLineMemberReceipt {
    ClubName: string;
    constructor(data: Uint8Array);
  }
  class ClubAgentReviewListRequest {
    ClubId: string;
  }
  class ClubAgentReviewListResponse {
    constructor(data: Uint8Array);
  }
  class ClubAgentReviewListReceipt {
    static ReviewData = class {
      ReviewId: number;
      PlayerId: number;
      PlayerNickName: string;
      PlayerHead: string;
      AgentId: number;
      AgentNickName: string;
      ReviewInfo: string;
    };
    TotCount: number;
    ReviewList: InstanceType<typeof GameLobbyProtocol.ClubAgentReviewListReceipt.ReviewData>[];
    constructor(data: Uint8Array);
  }
  class ClubAgentReviewReplyRequest {
    ClubId: string;
    ReviewId: number;
    IsAgree: number;
  }
  class ClubAgentReviewReplyResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ReviewAddClubReceipt {
    Msg: string;
    constructor(data: Uint8Array);
  }
  class ClubAgentShareLinkRequest {
    ClubId: string;
  }
  class ClubAgentShareLinkResponse {
    ShareLink: string;
    constructor(data: Uint8Array);
  }
  class ClubAgentTakeMoneyRequest {
    TakenAwayId: number;
    TakeType: number;
    ClubId: string;
    Money: number;
  }
  class ClubAgentTakeMoneyResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ClubNewPointReceipt {
    static ClubPlayerChangePoint = class {
      PlayerId: number;
      GamePoint: number;
    };
    ClubId: string;
    ClubPlayerChangePointList: InstanceType<typeof GameLobbyProtocol.ClubNewPointReceipt.ClubPlayerChangePoint>[];
    constructor(data: Uint8Array);
  }
  class ClubDownLineBanGamesRequest {
    SearchId: number;
    ClubId: string;
  }
  class ClubDownLineBanGamesResponse {
    constructor(data: Uint8Array);
  }
  class ClubDownLineBanGamesReceipt {
    static ClubDownLineGame = class {
      GameId: string;
      GameName: string;
      Ban: boolean;
    };
    SearchId: number;
    ClubId: string;
    ClubDownLineBanGames: InstanceType<typeof GameLobbyProtocol.ClubDownLineBanGamesReceipt.ClubDownLineGame>[];
    constructor(data: Uint8Array);
  }
  class ClubDownLineLeaveRecordRequest {
    ClubId: string;
  }
  class ClubDownLineLeaveRecordResponse {
    constructor(data: Uint8Array);
  }
  class ClubDownLineLeaveRecordReceipt {
    static ClubDownLineLeaveRecord = class {
      MemberId: number;
      MemberNick: string;
      MemberHead: string;
      Type: number;
      UpperId: number;
      CreateTime: string;
    };
    ClubDownLineLeaveRecords: InstanceType<typeof GameLobbyProtocol.ClubDownLineLeaveRecordReceipt.ClubDownLineLeaveRecord>[];
    TotCount: number;
    constructor(data: Uint8Array);
  }
  class ClubDownLinePerFsRequest {
    SearchId: number;
    ClubId: string;
  }
  class ClubDownLinePerFsResponse {
    constructor(data: Uint8Array);
  }
  class ClubDownLinePerFsReceipt {
    static ClubDownLinePerFs = class {
      PlayerId: number;
      NickName: string;
      Head: string;
      Money: number;
      MoneyMax: number;
      Agent: number;
      MinLimit: { [key: string]: number };
      MaxLimit: { [key: string]: number };
      Per: { [key: string]: number };
      Fs: { [key: string]: number };
      CanChat: number;
      LimitSet: number;
      BanGame: string;
      TotalAgent: number;
      TotalMember: number;
      PerfsSet: number;
    };
    State: number;
    TotalAgent: number;
    TotalAgentMoney: number;
    ClubDownLinePerFsData: InstanceType<typeof GameLobbyProtocol.ClubDownLinePerFsReceipt.ClubDownLinePerFs>[];
    constructor(data: Uint8Array);
  }
  class ClubDownlinePlayRecordRequest {
    StartTime: number;
    EtartTime: number;
    ClubId: string;
    MemberId: number;
    StartIdx: number;
    Count: number;
  }
  class ClubDownlinePlayRecordResponse {
    constructor(data: Uint8Array);
  }
  class ClubDownlinePlayRecordReceipt {
    static ClubMyselfPlayRecord = class {
      DateTime: string;
      GameId: number;
      BetArea: number;
      WinPt: number;
      GPointLeft: number;
    };
    StartIdx: number;
    ClubMyselfPlayRecords: InstanceType<typeof GameLobbyProtocol.ClubDownlinePlayRecordReceipt.ClubMyselfPlayRecord>[];
    constructor(data: Uint8Array);
  }
  class ClubDownLineReportRequest {
    ClubId: string;
    SearchId: number;
    StartTime: number;
    EndTime: number;
  }
  class ClubDownLineReportResponse {
    constructor(data: Uint8Array);
  }
  class ClubDownLineReportReceipt {
    static ClubDownLineReportGame = class {
      GameId: string;
      Count: number;
      BetPoint: number;
      RealBetPoint: number;
      FSPoint: number;
      WinPoint: number;
      RTP: number;
      FsSet: number;
      Sum: number;
      PerSet: number;
      ToUpPoint: number;
      RoomCardCnts: number;
    };
    static ClubMemberDownLineReport = class {
      MemberId: string;
      NickName: string;
      Head: string;
      GamePoints: number;
      Agent: number;
      ClubDownLineReportsGame: InstanceType<typeof GameLobbyProtocol.ClubDownLineReportReceipt.ClubDownLineReportGame>[];
    };
    MemberId: string;
    ClubMemberDownLineReports: { [key: string]: InstanceType<typeof GameLobbyProtocol.ClubDownLineReportReceipt.ClubMemberDownLineReport> };
    constructor(data: Uint8Array);
  }
  class ClubGameRecordRankRequest {
    StartTime: number;
    EndTime: number;
    ClubId: string;
    GameId: string;
  }
  class ClubGameRecordRankResponse {
    constructor(data: Uint8Array);
  }
  class ClubGameRecordRankReceipt {
    TotCount: number;
    ClubGameRecordRanks: GameLobbyProtocol.ClubGameRecordRank[];
    constructor(data: Uint8Array);
  }
  class ClubGameRecordRank {
    MemberId: number;
    NickName: string;
    TotRound: number;
    WinLose: number;
    TotRoomCard: number;
    constructor(data: Uint8Array);
  }
  class ClubMemberLeaveRequest {
    ClubId: string;
  }
  class ClubMemberLeaveResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ClubMyPointChangeRecordRequest {
    StartTime: number;
    EndTime: number;
    ClubId: string;
  }
  class ClubMyPointChangeRecordResponse {
    constructor(data: Uint8Array);
  }
  class ClubMyPointChangeRecordReceipt {
    static ClubMyPointRecord = class {
      Type: number;
      DateTime: string;
      BeforenPt: number;
      DeltaPt: number;
      AfterPt: number;
      Member: string;
    };
    ClubMyPointRecords: InstanceType<typeof GameLobbyProtocol.ClubMyPointChangeRecordReceipt.ClubMyPointRecord>[];
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordRequest {
    StartTime: number;
    EtartTime: number;
    ClubId: string;
  }
  class ClubMyselfGameRecordResponse {
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordReceipt {
    ClubMyselfGameRecords: GameLobbyProtocol.ClubMyselfGameRecord[];
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecord {
    RoomId: string;
    TotalRound: number;
    Ante: number;
    ResultTime: string;
    GameName: string;
    ClubMyselfGameRecordPlayers: GameLobbyProtocol.ClubMyselfGameRecordPlayer[];
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordPlayer {
    PlayerId: number;
    NickName: string;
    WinPt: number;
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordV2Request {
    StartTime: number;
    EtartTime: number;
    ClubId: string;
    MemberId: number;
    GameId: number;
    StartIdx: number;
    Count: number;
  }
  class ClubMyselfGameRecordV2Response {
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordV2Receipt {
    StartIdx: number;
    ClubMyselfGameRecords: GameLobbyProtocol.ClubMyselfGameRecordV2[];
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordV2 {
    GameId: number;
    RoomId: number;
    Rounds: number;
    WinPt: number;
    Ante: number;
    ResultTime: string;
    ClubMyselfGameRecordPlayers: GameLobbyProtocol.ClubMyselfGameRecordV2Player[];
    constructor(data: Uint8Array);
  }
  class ClubMyselfGameRecordV2Player {
    MemberId: number;
    NickName: string;
    BetPt: number;
    WinPt: number;
    BetArea: number;
    RoomCardCnts: number;
    Detail: string;
    constructor(data: Uint8Array);
  }
  class ClubRoomIdGameRecordRequest {
    RoomId: string;
    ClubId: string;
  }
  class ClubRoomIdGameRecordResponse {
    constructor(data: Uint8Array);
  }
  class ClubRoomIdGameRecordReceipt {
    ClubRoomIdGameRecords: GameLobbyProtocol.ClubRoomIdGameRecord[];
    constructor(data: Uint8Array);
  }
  class ClubRoomIdGameRecord {
    RoomId: string;
    Round: number;
    Ante: number;
    ResultTime: string;
    GameName: string;
    Detail: string;
    ClubRoomIdGameRecordPlayers: GameLobbyProtocol.ClubRoomIdGameRecordPlayer[];
    constructor(data: Uint8Array);
  }
  class ClubRoomIdGameRecordPlayer {
    PlayerId: number;
    NickName: string;
    WinPt: number;
    constructor(data: Uint8Array);
  }
  class ClubTableInfoRequest {
    ClubId: string;
  }
  class ClubTableInfoResponse {
    constructor(data: Uint8Array);
  }
  class ClubTableInfoReceipt {
    static PlayerInfo = class {
      PlayerId: number;
      Nickname: string;
      Head: string;
    };
    static GameTableData = class {
      GameId: number;
      Srvname: string;
      TableId: string;
      TableToken: string;
      MinBet: number;
      MaxBet: number;
      MinPlayers: number;
      Players: InstanceType<typeof GameLobbyProtocol.ClubTableInfoReceipt.PlayerInfo>[];
    };
    GameTables: InstanceType<typeof GameLobbyProtocol.ClubTableInfoReceipt.GameTableData>[];
    ClubId: string;
    ClubName: string;
    ClubPhoto: string;
    ClubMarquee: string;
    Note: string;
    UserAgent: number;
    GamePoint: number;
    constructor(data: Uint8Array);
  }
  class DeleteUserRequest {
  }
  class DeleteUserResponse {
    constructor(data: Uint8Array);
  }
  class DeleteUserReceipt {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterClubLobbyRequest {
    ClubId: string;
  }
  class EnterClubLobbyResponse {
    constructor(data: Uint8Array);
  }
  class EnterClubLobbyReceipt {
    ClubId: string;
    ClubName: string;
    ClubPhoto: string;
    ClubMarquee: string;
    GamePoint: number;
    CurMemberCnts: number;
    MemberCntsMax: number;
    Note: string;
    UserAgent: number;
    ApiGameSt: number;
    constructor(data: Uint8Array);
  }
  class IdInvitationAddClubRequest {
    InvitedId: number;
    ClubId: string;
  }
  class IdInvitationAddClubResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class IdInvitationAddClubReceipt {
    InviteId: number;
    InviteMemberId: number;
    ClubId: string;
    ClubPhoto: string;
    Msg: string;
    constructor(data: Uint8Array);
  }
  class IdInvitationAddClubReplyRequest {
    IsAgree: number;
    InviteId: number;
    ClubId: string;
  }
  class IdInvitationAddClubReplyResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class LeaverClubLobbyRequest {
  }
  class LeaverClubLobbyResponse {
    constructor(data: Uint8Array);
  }
  class LeaverClubLobbyReceipt {
    GamePoint: number;
    constructor(data: Uint8Array);
  }
  class LobbyInfoRequest {
    PlayerToken: string;
  }
  class LobbyInfoResponse {
    PlayerId: number;
    MemberId: number;
    NickName: string;
    Head: string;
    GamePoint: number;
    RoomCard: number;
    Sex: number;
    DebugLevel: number;
    Note: string;
    ClubId: string;
    ClubName: string;
    Games: GameLobbyProtocol.LobbyInfoGame[];
    constructor(data: Uint8Array);
  }
  class LobbyInfoGame {
    GameId: string;
    GameName: string;
    State: number;
    constructor(data: Uint8Array);
  }
  class LogoutNotifyReceipt {
    Info: string;
    constructor(data: Uint8Array);
  }
  class MaintenanceNotifyReceipt {
    Info: string;
    constructor(data: Uint8Array);
  }
  class PlatformDataRequest {
    PlayerToken: string;
    Account: string;
    NickName: string;
    Photo: string;
  }
  class PlatformDataResponse {
    constructor(data: Uint8Array);
  }
  class PlayerClubGameRecordRequest {
    ClubId: string;
  }
  class PlayerClubGameRecordResponse {
    GameRecordCount: number;
    ClubGameRecords: GameLobbyProtocol.ClubGameRecords[];
    constructor(data: Uint8Array);
  }
  class ClubGameRecords {
    No: number;
    RoundId: string;
    BetTime: string;
    GameRecordPlayers: GameLobbyProtocol.GameRecordPlayer[];
    constructor(data: Uint8Array);
  }
  class GameRecordPlayer {
    Name: string;
    BetPt: number;
    WinPt: number;
    Cards: string[];
    constructor(data: Uint8Array);
  }
  class PlayerClubListRequest {
  }
  class PlayerClubListResponse {
    ClubCount: number;
    Clubs: GameLobbyProtocol.LobbyInfoClubs[];
    constructor(data: Uint8Array);
  }
  class LobbyInfoClubs {
    ClubId: string;
    ClubName: string;
    ClubPhoto: string;
    CurMemberCnts: number;
    MemberCntsMax: number;
    constructor(data: Uint8Array);
  }
  class PlayerLoginRequest {
    LoginType: number;
    Account: string;
    Password: string;
    PlayerToken: string;
    Version: string;
  }
  class PlayerLoginResponse {
    State: number;
    PlayerToken: string;
    constructor(data: Uint8Array);
  }
  class PlayerLoginReceipt {
    State: number;
    PlayerToken: string;
    constructor(data: Uint8Array);
  }
  class PurchaseRequest {
    Platform: number;
    ProductId: string;
    Certificate: string;
    Value: number;
    Status: number;
  }
  class PurchaseResponse {
    constructor(data: Uint8Array);
  }
  class PurchaseReceipt {
    GamePoint: number;
    constructor(data: Uint8Array);
  }
  class SearchPlayerIdInfoRequest {
    SearchId: number;
  }
  class SearchPlayerIdInfoResponse {
    PlayerId: number;
    PlayerHead: string;
    PlayerNickName: string;
    constructor(data: Uint8Array);
  }
  class SetClubAgentRequest {
    ToAgentId: number;
    ClubId: string;
    Pr: { [key: string]: number };
    Fs: { [key: string]: number };
  }
  class SetClubAgentResponse {
    State: number;
    Per: { [key: string]: number };
    Fs: { [key: string]: number };
    constructor(data: Uint8Array);
  }
  class SetClubAgentPerFsRequest {
    ToId: number;
    ClubId: string;
    Pr: { [key: string]: number };
    Fs: { [key: string]: number };
  }
  class SetClubAgentPerFsResponse {
    State: number;
    ToId: number;
    Per: { [key: string]: number };
    Fs: { [key: string]: number };
    constructor(data: Uint8Array);
  }
  class SetClubDownLineBanGamesRequest {
    ToId: number;
    ClubId: string;
    DownLineAll: boolean;
    BanGameList: string[];
  }
  class SetClubDownLineBanGamesResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class SetClubDownLineLimitRequest {
    ToId: number;
    ClubId: string;
    Min: { [key: string]: number };
    Max: { [key: string]: number };
  }
  class SetClubDownLineLimitResponse {
    State: number;
    Min: { [key: string]: number };
    Max: { [key: string]: number };
    constructor(data: Uint8Array);
  }
  class SetClubDownLinePermissionRequest {
    ToId: number;
    ClubId: string;
    Type: number;
    SwitchPermission: boolean;
    Sync: number;
  }
  class SetClubDownLinePermissionResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class SetClubPlayerMaxMoneyRequest {
    ToId: number;
    ClubId: string;
    MaxMoney: number;
  }
  class SetClubPlayerMaxMoneyResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class ShareCodeDataRequest {
    AgentId: number;
    ShareCode: string;
  }
  class ShareCodeDataResponse {
    IsAdd: number;
    ClubId: string;
    ClubName: string;
    ClubNote: string;
    constructor(data: Uint8Array);
  }
  class UpdatePlayerHeadRequest {
    PlayerToken: string;
    NewHead: string;
  }
  class UpdatePlayerHeadResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class UpdatePlayerNickNameRequest {
    PlayerToken: string;
    NewNickName: string;
  }
  class UpdatePlayerNickNameResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class UpdatePlayerNoteRequest {
    PlayerToken: string;
    NewNote: string;
  }
  class UpdatePlayerNoteResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class UpdatePlayerSexRequest {
    PlayerToken: string;
    NewSex: number;
  }
  class UpdatePlayerSexResponse {
    State: number;
    constructor(data: Uint8Array);
  }
  class VerifyPlayerTokenRequest {
    PlayerToken: string;
    Version: string;
  }
  class VerifyPlayerTokenResponse {
    State: number;
    PlayerToken: string;
    PlayerId: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace GateProtocol {
  class QueryConnectorRequest {
  }
  class QueryConnectorResponse {
    Name: string;
    Host: string;
    Port: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace HorseRacingProtocol {
  class BetInfo {
    BetType: HorseRacingProtocol.BetType;
    Amount: number;
  }
  class BetType {
    constructor(data: Uint8Array);
  }
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: HorseRacingProtocol.TableInfo;
    Players: HorseRacingProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof HorseRacingProtocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    LastSno: string;
    Sno: string;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
    LastFinalHorses: number[];
    OddsTable: { [key: number]: number };
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: HorseRacingProtocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static Recode = class {
      ResultDate: string;
      ResultTime: string;
      Ranks: number[];
    };
    Records: InstanceType<typeof HorseRacingProtocol.GetTrendChartResponse.Recode>[];
    constructor(data: Uint8Array);
  }
  class IdleSyncPoint {
    Table: HorseRacingProtocol.TableInfo;
    Players: HorseRacingProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    BetInfo: HorseRacingProtocol.BetInfo[];
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    BetInfo: HorseRacingProtocol.BetInfo[];
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static PlayerBetOutcomeInfo = class {
      static WinBetting = class {
        BetInfo: any;
        WinPoints: number;
        Odds: number;
      };
      Id: number;
      WinBettingList: InstanceType<typeof HorseRacingProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.WinBetting>[];
      TotalBetPoints: number;
      TotalWinPoints: number;
      CurrentPoints: number;
    };
    PlayersBetOutcome: InstanceType<typeof HorseRacingProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: HorseRacingProtocol.TableInfo;
    Players: HorseRacingProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static Bonus = class {
      BetType: any;
      Mutiple: number;
    };
    FinalHorses: number[];
    BonusList: InstanceType<typeof HorseRacingProtocol.ShowdownState.Bonus>[];
    RoundOutcome: HorseRacingProtocol.RoundOutcomeInfo;
    FinalType: HorseRacingProtocol.BetType;
    GoldenHorseMutiple: number;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: HorseRacingProtocol.TableInfo;
    Players: HorseRacingProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof HorseRacingProtocol.ShowdownSyncPoint.PlayerBetInfo>[];
    FinalHorses: number[];
    BonusList: any[];
    RoundOutcome: HorseRacingProtocol.RoundOutcomeInfo;
    FinalType: HorseRacingProtocol.BetType;
    GoldenHorseMutiple: number;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace JuYouGamesProtocol {
  class BetHistoryRequest {
    GameName: string;
  }
  class BetHistoryResponse {
    History_Data: string[];
    constructor(data: Uint8Array);
  }
  class ChatRequest {
    TableToken: string;
    SeatId: number;
    Msg: string;
    EmojiIdx: number;
  }
  class ChatResponse {
    constructor(data: Uint8Array);
  }
  class ChatReceipt {
    TableToken: string;
    PlayerId: number;
    SeatId: number;
    Nickname: string;
    Msg: string;
    EmojiIdx: number;
    constructor(data: Uint8Array);
  }
  class GamePlayerListRequest {
    TableToken: string;
  }
  class GamePlayerListResponse {
    constructor(data: Uint8Array);
  }
  class GamePlayerListReceipt {
    static PlayerInfo = class {
      PlayerId: number;
      Head: string;
      Nickname: string;
      GamePoint: number;
      PlayRounds: number;
      WinRounds: number;
      TotalBet: number;
      TotalWin: number;
    };
    TableToken: string;
    PlayerInfoList: InstanceType<typeof JuYouGamesProtocol.GamePlayerListReceipt.PlayerInfo>[];
    constructor(data: Uint8Array);
  }
  class GetUsedChipsRequest {
    GameId: number;
  }
  class GetUsedChipsResponse {
    constructor(data: Uint8Array);
  }
  class GetUsedChipsReceipt {
    GameId: number;
    ChipsList: number[];
    constructor(data: Uint8Array);
  }
  class NewTableTokenReceipt {
    roomtoken: string;
    constructor(data: Uint8Array);
  }
  class ReceiptMessage {
    MessageType: string;
    MessageContent: Uint8Array;
    constructor(data: Uint8Array);
  }
  class ReplySyncRequest {
    TableToken: string;
    SyncId: number;
  }
  class ReplySyncResponse {
    constructor(data: Uint8Array);
  }
  class SetUsedChipsRequest {
    GameId: number;
    ChipsList: number[];
  }
  class SetUsedChipsResponse {
    constructor(data: Uint8Array);
  }
  class StartNewRoundMessage {
    TableToken: string;
    RoundId: number;
    constructor(data?: Uint8Array);
  }
  class StateMessage {
    SyncId: number;
    SyncTime: number;
    MessageType: string;
    MessageContent: Uint8Array;
    constructor(data: Uint8Array);
  }
  class SyncPoint {
    Name: string;
    Data: Uint8Array;
    SyncId: number;
    SyncTime: number;
    SyncRemainingTime: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace NineBladeProtocol {
  class AskPlayersBetState {
    static Seat = class {
      IsFirstRound: boolean;
      IsPlayerBet: boolean;
      IsPlayerNeedAgainBet: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.AskPlayersBetState.Seat> };
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static Seat = class {
      IsFirstRound: boolean;
      IsPlayerBet: boolean;
      IsPlayerNeedAgainBet: boolean;
    };
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.BetTimeSyncPoint.Seat> };
    constructor(data: Uint8Array);
  }
  class AskPlayersBuyState {
    Seats: number[];
    constructor(data: Uint8Array);
  }
  class AskPlayersBuySyncPoint {
    constructor(data: Uint8Array);
  }
  class PlayersStartRequest {
    TableToken: string;
    IsPlayerStart: boolean;
  }
  class PlayersStartResponse {
    constructor(data: Uint8Array);
  }
  class PlayersStartReceipt {
    Start: boolean;
    IsFirstRound: boolean;
    constructor(data: Uint8Array);
  }
  class BuyRequest {
    TableToken: string;
    SeatId: number;
    IsBuy: number;
  }
  class BuyResponse {
    constructor(data: Uint8Array);
  }
  class BuyReceipt {
    SeatId: number;
    BetAmount: number;
    GamePoint: number;
    AllBet: number;
    constructor(data: Uint8Array);
  }
  class CompareRequest {
    TableToken: string;
  }
  class CompareResponse {
    constructor(data: Uint8Array);
  }
  class Winner {
    frontWinSeatId: number;
    backWinSeatId: number;
    LastWinSeatId: number;
    constructor(data: Uint8Array);
  }
  class CompareState {
    static Seat = class {
      Id: number;
      TotalBet: number;
      IsTie: number;
      Hands: InstanceType<typeof NineBladeProtocol.CompareState.Hand>[];
    };
    static Hand = class {
      HandType: number;
      HandSubType: number;
      Cards: number[];
    };
    SeatId: number;
    Winner: NineBladeProtocol.Winner;
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.CompareState.Seat> };
    constructor(data: Uint8Array);
  }
  class CompareSyncPoint {
    static Seat = class {
      Id: number;
      TotalBet: number;
      IsTie: number;
      Hands: InstanceType<typeof NineBladeProtocol.CompareSyncPoint.Hand>[];
    };
    static Hand = class {
      HandType: number;
      HandSubType: number;
      Cards: number[];
    };
    SeatId: number;
    MinBet: number;
    TotBet: number;
    WatchOn: number;
    Winner: NineBladeProtocol.Winner;
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.CompareSyncPoint.Seat> };
    constructor(data: Uint8Array);
  }
  class CompareResult {
    static Seat = class {
      SeatId: number;
      Nickname: string;
      GPoint: number;
      HandType: number;
      HandSubType: number;
      BetPt: number;
      WinPt: number;
      CardsList: number[];
    };
    LastWiner: number;
    SeatsData: InstanceType<typeof NineBladeProtocol.CompareResult.Seat>[];
    constructor(data: Uint8Array);
  }
  class CompareResultSyncPoint {
    constructor(data: Uint8Array);
  }
  class ContinueRequest {
    TableToken: string;
    Continue: number;
  }
  class ContinueResponse {
    constructor(data: Uint8Array);
  }
  class ContinueReceipt {
    State: number;
    constructor(data: Uint8Array);
  }
  class DealAllCardsState {
    static Hand = class {
      Cards: number[];
    };
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.DealAllCardsState.Hand> };
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static Hand = class {
      Cards: number[];
    };
    SeatId: number;
    MinBet: number;
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.DealingSyncPoint.Hand> };
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    GPoint: number;
    TotBet: number;
    PlayerSeatId: number;
    IsLeaveGame: boolean;
    TotalSeat: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class ExitGameTrueRequest {
    TableToken: string;
  }
  class ExitGameTrueResponse {
    constructor(data: Uint8Array);
  }
  class ExitGameTrueReceipt {
    PlayerId: number;
    SeatCount: number;
    constructor(data: Uint8Array);
  }
  class GameBalanceState {
    static Seat = class {
      SeatId: number;
      Nickname: string;
      GPoint: number;
      BetPt: number;
      WinPt: number;
    };
    SeatsData: InstanceType<typeof NineBladeProtocol.GameBalanceState.Seat>[];
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class GameBalanceSyncPoint {
    static Seat = class {
      SeatId: number;
      Nickname: string;
      GPoint: number;
      BetPt: number;
      WinPt: number;
      Hands: InstanceType<typeof NineBladeProtocol.GameBalanceSyncPoint.Hand>[];
    };
    static Hand = class {
      HandType: number;
      HandSubType: number;
      Cards: number[];
    };
    static Winners = class {
      frontWinSeatId: number;
      backWinSeatId: number;
      LastWinSeatId: number;
    };
    SeatId: number;
    MinBet: number;
    TotBet: number;
    WatchOn: number;
    TimeLeft: number;
    Winner: InstanceType<typeof NineBladeProtocol.GameBalanceSyncPoint.Winners>;
    SeatsData: InstanceType<typeof NineBladeProtocol.GameBalanceSyncPoint.Seat>[];
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class GameHintReceipt {
    NeedClose: boolean;
    constructor(data: Uint8Array);
  }
  class GameTrendRequest {
    TableToken: string;
  }
  class GameTrendResponse {
    constructor(data: Uint8Array);
  }
  class GameTrendReceipt {
    static GameTrendPlayer = class {
      PlayerId: number;
      NickName: string;
      Result: number;
    };
    static GameTrend = class {
      Round: number;
      Ante: number;
      BuyCardsCnt: number;
      TotalWin: number;
      GameTrendPlayers: { [key: number]: InstanceType<typeof NineBladeProtocol.GameTrendReceipt.GameTrendPlayer> };
    };
    GameTrends: InstanceType<typeof NineBladeProtocol.GameTrendReceipt.GameTrend>[];
    constructor(data: Uint8Array);
  }
  class JoinTableRequest {
    TableToken: string;
    SeatId: number;
  }
  class JoinTableResponse {
    constructor(data: Uint8Array);
  }
  class JoinTableReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class LeaveTableRequest {
    TableToken: string;
    SeatId: number;
  }
  class LeaveTableResponse {
    constructor(data: Uint8Array);
  }
  class LeaveTableReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    SeatId: number;
    BetAmount: number;
  }
  class PlaceBetResponse {
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    SeatId: number;
    BetAmount: number;
    GamePoint: number;
    allBet: number;
    constructor(data: Uint8Array);
  }
  class PlayersSortRequest {
    TableToken: string;
    SeatId: number;
    frontHandOne: number;
    frontHandTwo: number;
    backHandOne: number;
    backHandTwo: number;
    Cards: number[];
  }
  class PlayersSortResponse {
    Cards: number[];
    constructor(data: Uint8Array);
  }
  class PlayersSortState {
    static AllNiuNiu = class {
      NiuNius: InstanceType<typeof NineBladeProtocol.PlayersSortState.NiuNiu>[];
      OneBtnSorts: InstanceType<typeof NineBladeProtocol.PlayersSortState.OneBtnSort>[];
      haveNiu: boolean;
    };
    static NiuNiu = class {
      Cards: number[];
    };
    static OneBtnSort = class {
      Cards: number[];
    };
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.PlayersSortState.AllNiuNiu> };
    constructor(data: Uint8Array);
  }
  class PlayersSortSyncPoint {
    static AllNiuNiu = class {
      NiuNius: InstanceType<typeof NineBladeProtocol.PlayersSortSyncPoint.NiuNiu>[];
      OneBtnSorts: InstanceType<typeof NineBladeProtocol.PlayersSortSyncPoint.OneBtnSort>[];
      haveNiu: boolean;
    };
    static NiuNiu = class {
      Cards: number[];
    };
    static OneBtnSort = class {
      Cards: number[];
    };
    TimeLeft: number;
    SeatId: number;
    MinBet: number;
    TotBet: number;
    WatchOn: number;
    IsFinishSort: boolean;
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.PlayersSortSyncPoint.AllNiuNiu> };
    constructor(data: Uint8Array);
  }
  class ReadyBtnReceipt {
    ReadyBtn: boolean;
    Enable: boolean;
    constructor(data: Uint8Array);
  }
  class StartRoundState {
    TimeLeft: number;
    constructor(data: Uint8Array);
  }
  class StartRoundSyncPoint {
    TimeLeft: number;
    SeatId: number;
    MinBet: number;
    constructor(data: Uint8Array);
  }
  class TableInfoRequest {
    TableToken: string;
  }
  class TableInfoResponse {
    constructor(data: Uint8Array);
  }
  class TableInfoReceipt {
    static Seat = class {
      Nickname: string;
      Head: string;
      PlayerId: number;
      GPoint: number;
      Record: number;
      NotEnough: boolean;
      WatchOn: number;
    };
    TableLeader: number;
    WatchOn: number;
    GameEnterState: number;
    GameSerNum: string;
    DicePointOne: number;
    DicePointTwo: number;
    TableNeedBetPoint: number;
    TotBet: number;
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.TableInfoReceipt.Seat> };
    constructor(data: Uint8Array);
  }
  class WaitForPlayerState {
    constructor(data: Uint8Array);
  }
  class IdleSyncPoint {
    WaitTime: number;
    constructor(data: Uint8Array);
  }
  class WaitForPlayerReceipt {
    static Seat = class {
      Nickname: string;
      GPoint: number;
    };
    Seats: { [key: number]: InstanceType<typeof NineBladeProtocol.WaitForPlayerReceipt.Seat> };
    constructor(data: Uint8Array);
  }
}

export declare namespace NiuNiuProtocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableBetInfo = class {
      AllBets: number[];
    };
    static PlayerBetInfo = class {
      Id: number;
      TotalBet: number;
    };
    Table: NiuNiuProtocol.TableInfo;
    TableBet: InstanceType<typeof NiuNiuProtocol.BetTimeSyncPoint.TableBetInfo>;
    Players: NiuNiuProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof NiuNiuProtocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    ReadyTime: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
  }
  class DealingState {
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    Table: NiuNiuProtocol.TableInfo;
    Players: NiuNiuProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: NiuNiuProtocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static Seat = class {
        Id: number;
        PlayerName: string;
        HandType: number;
      };
      RoundId: number;
      Seats: InstanceType<typeof NiuNiuProtocol.GetTrendChartResponse.RoundOutcome.Seat>[];
    };
    RoundsOutcome: InstanceType<typeof NiuNiuProtocol.GetTrendChartResponse.RoundOutcome>[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    Type: number;
    Cards: number[];
    SortedCards: number[];
  }
  class IdleSyncPoint {
    Table: NiuNiuProtocol.TableInfo;
    Players: NiuNiuProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class JoinTableRequest {
    TableToken: string;
    SeatId: number;
  }
  class JoinTableResponse {
    constructor(data: Uint8Array);
  }
  class JoinTableReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class LeaveTableRequest {
    TableToken: string;
  }
  class LeaveTableResponse {
    constructor(data: Uint8Array);
  }
  class LeaveTableReceipt {
    PlayerId: number;
    SeatId: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    BetAmount: number;
  }
  class PlaceBetResponse {
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    SeatId: number;
    BetAmount: number;
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    static PlayerBetOutcomeInfo = class {
      Id: number;
      GameMode: number;
      Multiple: number;
      TotalAmount: number;
    };
    DealerBetOutcome: InstanceType<typeof NiuNiuProtocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: { [key: number]: InstanceType<typeof NiuNiuProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo> };
  }
  class RoundStartState {
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: NiuNiuProtocol.TableInfo;
    Players: NiuNiuProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class SeatInfoRequest {
    TableToken: string;
  }
  class SeatInfoResponse {
    constructor(data: Uint8Array);
  }
  class SeatInfoReceipt {
    static SeatInfo = class {
      HeadId: string;
      Nickname: string;
      GamePoint: number;
      BetPoint: number;
      PlayerId: number;
    };
    Seats: { [key: number]: InstanceType<typeof NiuNiuProtocol.SeatInfoReceipt.SeatInfo> };
    constructor(data: Uint8Array);
  }
  class SelectGameModeRequest {
    TableToken: string;
    GameMode: number;
  }
  class SelectGameModeResponse {
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static PlayerBetInfo = class {
      Id: number;
      Hand: any;
    };
    Seats: { [key: number]: InstanceType<typeof NiuNiuProtocol.ShowdownState.PlayerBetInfo> };
    RoundOutcome: NiuNiuProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableBetInfo = class {
      AllBets: number[];
    };
    static PlayerBetInfo = class {
      Id: number;
      TotalBet: number;
      Hand: any;
    };
    Table: NiuNiuProtocol.TableInfo;
    TableBet: InstanceType<typeof NiuNiuProtocol.ShowdownSyncPoint.TableBetInfo>;
    Players: NiuNiuProtocol.PlayerInfo[];
    Seats: { [key: number]: InstanceType<typeof NiuNiuProtocol.ShowdownSyncPoint.PlayerBetInfo> };
    RoundOutcome: NiuNiuProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
}

export declare namespace NiuNiu2Protocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableExInfo = class {
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      BettingAreas: InstanceType<typeof NiuNiu2Protocol.BetTimeSyncPoint.TableBetInfo.BettingArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof NiuNiu2Protocol.BetTimeSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
      PreGPoints: number;
    };
    Table: NiuNiu2Protocol.TableInfo;
    TableEx: InstanceType<typeof NiuNiu2Protocol.BetTimeSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof NiuNiu2Protocol.BetTimeSyncPoint.TableBetInfo>;
    Players: NiuNiu2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof NiuNiu2Protocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class DealingState {
    Dices: number[];
    FirstBase: number;
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static TableExInfo = class {
      Dices: number[];
      FirstBase: number;
    };
    Table: NiuNiu2Protocol.TableInfo;
    TableEx: InstanceType<typeof NiuNiu2Protocol.DealingSyncPoint.TableExInfo>;
    Players: NiuNiu2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    BetLimit: number[];
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: NiuNiu2Protocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static HandArea = class {
        Id: number;
        HandType: number;
        Outcome: number;
      };
      RoundId: number;
      HandAreas: InstanceType<typeof NiuNiu2Protocol.GetTrendChartResponse.RoundOutcome.HandArea>[];
    };
    static Record = class {
      Id: number;
      Wins: number;
      Losses: number;
      Ties: number;
    };
    RoundsOutcome: InstanceType<typeof NiuNiu2Protocol.GetTrendChartResponse.RoundOutcome>[];
    Records: InstanceType<typeof NiuNiu2Protocol.GetTrendChartResponse.Record>[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    Type: number;
    Cards: number[];
    SortedCards: number[];
  }
  class IdleSyncPoint {
    Table: NiuNiu2Protocol.TableInfo;
    Players: NiuNiu2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    AreaId: number;
    BetAmount: number;
    AllCredits: number[];
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    AreaId: number;
    BetAmount: number;
    BetCredits: number[];
    PreGPoints: number;
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    static PlayerBetOutcomeInfo = class {
      static BettingArea = class {
        Id: number;
        Amount: number;
        Multiple: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof NiuNiu2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.BettingArea>[];
      TotalAmount: number;
      GPoints: number;
    };
    DealerBetOutcome: InstanceType<typeof NiuNiu2Protocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: InstanceType<typeof NiuNiu2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: NiuNiu2Protocol.TableInfo;
    Players: NiuNiu2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static HandArea = class {
      Id: number;
      Hand: any;
      Outcome: number;
    };
    HandAreas: InstanceType<typeof NiuNiu2Protocol.ShowdownState.HandArea>[];
    RoundOutcome: NiuNiu2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableExInfo = class {
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      static HandArea = class {
        Id: number;
        Hand: any;
        Outcome: number;
      };
      BettingAreas: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.TableBetInfo.BettingArea>[];
      HandAreas: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.TableBetInfo.HandArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
      PreGPoints: number;
    };
    Table: NiuNiu2Protocol.TableInfo;
    TableEx: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.TableBetInfo>;
    Players: NiuNiu2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof NiuNiu2Protocol.ShowdownSyncPoint.PlayerBetInfo>[];
    RoundOutcome: NiuNiu2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace PhoenixProtocol {
  class BetInfo {
    BetId: string;
    BetAmount: number;
    Multiplier: number;
    WinAmount: number;
    CashedOut: boolean;
  }
  class BetResult {
    BetId: string;
    BetAmount: number;
    Multiplier: number;
    WinAmount: number;
    GPoints: number;
    constructor(data: Uint8Array);
  }
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: PhoenixProtocol.TableInfo;
    Players: PhoenixProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PhoenixProtocol.BetTimeSyncPoint.PlayerBetInfo>[];
    AutoCashOut: number;
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    LastSno: string;
    Sno: string;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class CashOutRequest {
    TableToken: string;
    BetId: string;
  }
  class CashOutResponse {
    BetResult: PhoenixProtocol.BetResult;
    constructor(data: Uint8Array);
  }
  class CashOutReceipt {
    PlayerId: number;
    BetResult: PhoenixProtocol.BetResult;
    constructor(data: Uint8Array);
  }
  class CashOutAllRequest {
    TableToken: string;
  }
  class CashOutAllResponse {
    List: PhoenixProtocol.BetResult[];
    constructor(data: Uint8Array);
  }
  class CashOutAllReceipt {
    PlayerId: number;
    List: PhoenixProtocol.BetResult[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: PhoenixProtocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetBetRankingListRequest {
    TableToken: string;
  }
  class GetBetRankingListResponse {
    static Player = class {
      Id: number;
      TotalBetAmount: number;
    };
    List: InstanceType<typeof PhoenixProtocol.GetBetRankingListResponse.Player>[];
    constructor(data: Uint8Array);
  }
  class GetOnlinePlayerCountRequest {
    TableToken: string;
  }
  class GetOnlinePlayerCountResponse {
    PlayerCount: number;
    constructor(data: Uint8Array);
  }
  class GetRoundInfoHistoryRequest {
    TableToken: string;
  }
  class GetRoundInfoHistoryResponse {
    static RoundInfo = class {
      RoundId: string;
      Multiplier: number;
    };
    List: InstanceType<typeof PhoenixProtocol.GetRoundInfoHistoryResponse.RoundInfo>[];
    HistoricalMultiplier: number;
    TodaysMultiplier: number;
    constructor(data: Uint8Array);
  }
  class GetTotalWinPointsRankingListRequest {
    TableToken: string;
  }
  class GetTotalWinPointsRankingListResponse {
    static Player = class {
      NickName: string;
      TotalWinAmount: number;
    };
    List: InstanceType<typeof PhoenixProtocol.GetTotalWinPointsRankingListResponse.Player>[];
    constructor(data: Uint8Array);
  }
  class IdleSyncPoint {
    Table: PhoenixProtocol.TableInfo;
    Players: PhoenixProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class NotifyGameState {
    CurrentTime: number;
    GameOver: boolean;
    CurrentMultiplier: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    Amount: number;
  }
  class PlaceBetResponse {
    BetId: string;
    GPoints: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    BetInfo: PhoenixProtocol.BetInfo;
    constructor(data: Uint8Array);
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: PhoenixProtocol.TableInfo;
    Players: PhoenixProtocol.PlayerInfo[];
    AutoCashOut: number;
    constructor(data: Uint8Array);
  }
  class SetAutoCashOutRequest {
    TableToken: string;
    Multiplier: number;
  }
  class SetAutoCashOutResponse {
    Multiplier: number;
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    StartTime: number;
    Initial: number;
    Factor: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: PhoenixProtocol.TableInfo;
    Players: PhoenixProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PhoenixProtocol.ShowdownSyncPoint.PlayerBetInfo>[];
    StartTime: number;
    Initial: number;
    Factor: number;
    CurrentTime: number;
    GameOver: boolean;
    AutoCashOut: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace PK10Protocol {
  class BetInfo {
    Mode: number;
    Amount: number;
    Arg1: number;
    Arg2: number;
  }
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: PK10Protocol.TableInfo;
    Players: PK10Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PK10Protocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    static OddList = class {
      Odds: number[];
    };
    Id: string;
    LastSno: string;
    Sno: string;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
    LastFinalCars: number[];
    OddsTable: { [key: number]: InstanceType<typeof PK10Protocol.TableInfo.OddList> };
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: PK10Protocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static Recode = class {
      GameSerial: string;
      FinalCars: number[];
    };
    Records: InstanceType<typeof PK10Protocol.GetTrendChartResponse.Recode>[];
    constructor(data: Uint8Array);
  }
  class IdleSyncPoint {
    Table: PK10Protocol.TableInfo;
    Players: PK10Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    BetInfo: PK10Protocol.BetInfo;
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    BetInfo: PK10Protocol.BetInfo;
    constructor(data: Uint8Array);
  }
  class ResultSortDescRequest {
    TableToken: string;
  }
  class ResultSortDescResponse {
    static Result = class {
      Mode: number;
      Arg1: number;
      Arg2: number;
      Counts: number;
    };
    Results: InstanceType<typeof PK10Protocol.ResultSortDescResponse.Result>[];
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static PlayerBetOutcomeInfo = class {
      static WinBetting = class {
        BetInfo: any;
        WinPoints: number;
        Odds: number;
      };
      Id: number;
      WinBettingList: InstanceType<typeof PK10Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.WinBetting>[];
      TotalBetPoints: number;
      TotalWinPoints: number;
      CurrentPoints: number;
    };
    PlayersBetOutcome: InstanceType<typeof PK10Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: PK10Protocol.TableInfo;
    Players: PK10Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    FinalCars: number[];
    RoundOutcome: PK10Protocol.RoundOutcomeInfo;
    DataUrl: string;
    DataKey: string;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static PlayerBetInfo = class {
      Id: number;
      BetList: any[];
    };
    Table: PK10Protocol.TableInfo;
    Players: PK10Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PK10Protocol.ShowdownSyncPoint.PlayerBetInfo>[];
    FinalCars: number[];
    RoundOutcome: PK10Protocol.RoundOutcomeInfo;
    DataUrl: string;
    DataKey: string;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace PushingDotProtocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    static TableBetInfo = class {
      static Area = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Areas: InstanceType<typeof PushingDotProtocol.BetTimeSyncPoint.TableBetInfo.Area>[];
    };
    static PlayerBetInfo = class {
      static Area = class {
        Id: number;
        TotalBet: number;
      };
      Id: number;
      Areas: InstanceType<typeof PushingDotProtocol.BetTimeSyncPoint.PlayerBetInfo.Area>[];
      TotalBet: number;
    };
    Table: PushingDotProtocol.TableInfo;
    TableEx: InstanceType<typeof PushingDotProtocol.BetTimeSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof PushingDotProtocol.BetTimeSyncPoint.TableBetInfo>;
    Players: PushingDotProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PushingDotProtocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
  }
  class DealingState {
    RemainingCardCount: number;
    Dice1: number;
    Dice2: number;
    Dice3: number;
    FirstBase: number;
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    Table: PushingDotProtocol.TableInfo;
    TableEx: InstanceType<typeof PushingDotProtocol.DealingSyncPoint.TableExInfo>;
    Players: PushingDotProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: PushingDotProtocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static Area = class {
        Id: number;
        Hand: any;
        Outcome: number;
      };
      RoundId: number;
      Areas: InstanceType<typeof PushingDotProtocol.GetTrendChartResponse.RoundOutcome.Area>[];
    };
    static Record = class {
      Id: number;
      Wins: number;
      Losses: number;
      Ties: number;
    };
    RoundsOutcome: InstanceType<typeof PushingDotProtocol.GetTrendChartResponse.RoundOutcome>[];
    Records: InstanceType<typeof PushingDotProtocol.GetTrendChartResponse.Record>[];
    DealtCards: number[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    HandType: number;
    Card1: number;
    Card2: number;
    Total: number;
  }
  class IdleSyncPoint {
    Table: PushingDotProtocol.TableInfo;
    Players: PushingDotProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    AreaId: number;
    BetAmount: number;
  }
  class PlaceBetResponse {
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    AreaId: number;
    BetAmount: number;
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static PlayerBetOutcomeInfo = class {
      static Area = class {
        Id: number;
        Amount: number;
        Multiple: number;
      };
      Id: number;
      Areas: InstanceType<typeof PushingDotProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.Area>[];
      TotalAmount: number;
    };
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    DealerBetOutcome: InstanceType<typeof PushingDotProtocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: InstanceType<typeof PushingDotProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: PushingDotProtocol.TableInfo;
    Players: PushingDotProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static Area = class {
      Id: number;
      Hand: any;
    };
    Dealer: PushingDotProtocol.HandInfo;
    Areas: InstanceType<typeof PushingDotProtocol.ShowdownState.Area>[];
    RoundOutcome: PushingDotProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    static TableBetInfo = class {
      static Area = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
        Hand: any;
      };
      Dealer: any;
      Areas: InstanceType<typeof PushingDotProtocol.ShowdownSyncPoint.TableBetInfo.Area>[];
    };
    static PlayerBetInfo = class {
      static Area = class {
        Id: number;
        TotalBet: number;
      };
      Id: number;
      Areas: InstanceType<typeof PushingDotProtocol.ShowdownSyncPoint.PlayerBetInfo.Area>[];
      TotalBet: number;
    };
    Table: PushingDotProtocol.TableInfo;
    TableEx: InstanceType<typeof PushingDotProtocol.ShowdownSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof PushingDotProtocol.ShowdownSyncPoint.TableBetInfo>;
    Players: PushingDotProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PushingDotProtocol.ShowdownSyncPoint.PlayerBetInfo>[];
    RoundOutcome: PushingDotProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
}

export declare namespace PushingDot2Protocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      BettingAreas: InstanceType<typeof PushingDot2Protocol.BetTimeSyncPoint.TableBetInfo.BettingArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof PushingDot2Protocol.BetTimeSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
      PreGPoints: number;
    };
    Table: PushingDot2Protocol.TableInfo;
    TableEx: InstanceType<typeof PushingDot2Protocol.BetTimeSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof PushingDot2Protocol.BetTimeSyncPoint.TableBetInfo>;
    Players: PushingDot2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PushingDot2Protocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class DealingState {
    RemainingCardCount: number;
    Dices: number[];
    FirstBase: number;
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    Table: PushingDot2Protocol.TableInfo;
    TableEx: InstanceType<typeof PushingDot2Protocol.DealingSyncPoint.TableExInfo>;
    Players: PushingDot2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    BetLimit: number[];
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: PushingDot2Protocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static HandArea = class {
        Id: number;
        HandType: number;
        Outcome: number;
      };
      RoundId: number;
      HandAreas: InstanceType<typeof PushingDot2Protocol.GetTrendChartResponse.RoundOutcome.HandArea>[];
    };
    static Record = class {
      Id: number;
      Wins: number;
      Losses: number;
      Ties: number;
    };
    RoundsOutcome: InstanceType<typeof PushingDot2Protocol.GetTrendChartResponse.RoundOutcome>[];
    Records: InstanceType<typeof PushingDot2Protocol.GetTrendChartResponse.Record>[];
    DealtCards: number[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    Type: number;
    Cards: number[];
    SortedCards: number[];
  }
  class IdleSyncPoint {
    Table: PushingDot2Protocol.TableInfo;
    Players: PushingDot2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    AreaId: number;
    BetAmount: number;
    AllCredits: number[];
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    AreaId: number;
    BetAmount: number;
    BetCredits: number[];
    PreGPoints: number;
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    static PlayerBetOutcomeInfo = class {
      static BettingArea = class {
        Id: number;
        Amount: number;
        Multiple: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof PushingDot2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.BettingArea>[];
      TotalAmount: number;
      GPoints: number;
    };
    DealerBetOutcome: InstanceType<typeof PushingDot2Protocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: InstanceType<typeof PushingDot2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: PushingDot2Protocol.TableInfo;
    Players: PushingDot2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static HandArea = class {
      Id: number;
      Hand: any;
      Outcome: number;
    };
    HandAreas: InstanceType<typeof PushingDot2Protocol.ShowdownState.HandArea>[];
    RoundOutcome: PushingDot2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      static HandArea = class {
        Id: number;
        Hand: any;
        Outcome: number;
      };
      BettingAreas: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.TableBetInfo.BettingArea>[];
      HandAreas: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.TableBetInfo.HandArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
      PreGPoints: number;
    };
    Table: PushingDot2Protocol.TableInfo;
    TableEx: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.TableBetInfo>;
    Players: PushingDot2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof PushingDot2Protocol.ShowdownSyncPoint.PlayerBetInfo>[];
    RoundOutcome: PushingDot2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
}

export declare namespace SkyNineProtocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    static TableBetInfo = class {
      static Area = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Areas: InstanceType<typeof SkyNineProtocol.BetTimeSyncPoint.TableBetInfo.Area>[];
    };
    static PlayerBetInfo = class {
      static Area = class {
        Id: number;
        TotalBet: number;
      };
      Id: number;
      Areas: InstanceType<typeof SkyNineProtocol.BetTimeSyncPoint.PlayerBetInfo.Area>[];
      TotalBet: number;
    };
    Table: SkyNineProtocol.TableInfo;
    TableEx: InstanceType<typeof SkyNineProtocol.BetTimeSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof SkyNineProtocol.BetTimeSyncPoint.TableBetInfo>;
    Players: SkyNineProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof SkyNineProtocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
  }
  class Card {
    Type: number;
    Value: number;
    Order: number;
    constructor(data: Uint8Array);
  }
  class DealingState {
    RemainingCardCount: number;
    Dice1: number;
    Dice2: number;
    Dice3: number;
    FirstBase: number;
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    Table: SkyNineProtocol.TableInfo;
    TableEx: InstanceType<typeof SkyNineProtocol.DealingSyncPoint.TableExInfo>;
    Players: SkyNineProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: SkyNineProtocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static Area = class {
        Id: number;
        Hand: any;
        Outcome: number;
      };
      RoundId: number;
      Areas: InstanceType<typeof SkyNineProtocol.GetTrendChartResponse.RoundOutcome.Area>[];
    };
    static Record = class {
      Id: number;
      Wins: number;
      Losses: number;
      Ties: number;
    };
    RoundsOutcome: InstanceType<typeof SkyNineProtocol.GetTrendChartResponse.RoundOutcome>[];
    Records: InstanceType<typeof SkyNineProtocol.GetTrendChartResponse.Record>[];
    DealtCards: SkyNineProtocol.Card[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    static Hand = class {
      Type: number;
      Name: string;
      Card1: any;
      Card2: any;
      Total: number;
    };
    Front: InstanceType<typeof SkyNineProtocol.HandInfo.Hand>;
    Back: InstanceType<typeof SkyNineProtocol.HandInfo.Hand>;
  }
  class IdleSyncPoint {
    Table: SkyNineProtocol.TableInfo;
    Players: SkyNineProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    AreaId: number;
    BetAmount: number;
  }
  class PlaceBetResponse {
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    AreaId: number;
    BetAmount: number;
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static PlayerBetOutcomeInfo = class {
      static Area = class {
        Id: number;
        Amount: number;
      };
      Id: number;
      Areas: InstanceType<typeof SkyNineProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.Area>[];
      TotalAmount: number;
    };
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    static Area = class {
      Id: number;
      FrontResult: number;
      BackResult: number;
    };
    DealerBetOutcome: InstanceType<typeof SkyNineProtocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: InstanceType<typeof SkyNineProtocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
    Areas: InstanceType<typeof SkyNineProtocol.RoundOutcomeInfo.Area>[];
  }
  class RoundStartState {
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: SkyNineProtocol.TableInfo;
    Players: SkyNineProtocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static Area = class {
      Id: number;
      Hand: any;
    };
    Dealer: SkyNineProtocol.HandInfo;
    Areas: InstanceType<typeof SkyNineProtocol.ShowdownState.Area>[];
    RoundOutcome: SkyNineProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dice1: number;
      Dice2: number;
      Dice3: number;
      FirstBase: number;
    };
    static TableBetInfo = class {
      static Area = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
        Hand: any;
      };
      Dealer: any;
      Areas: InstanceType<typeof SkyNineProtocol.ShowdownSyncPoint.TableBetInfo.Area>[];
    };
    static PlayerBetInfo = class {
      static Area = class {
        Id: number;
        TotalBet: number;
      };
      Id: number;
      Areas: InstanceType<typeof SkyNineProtocol.ShowdownSyncPoint.PlayerBetInfo.Area>[];
      TotalBet: number;
    };
    Table: SkyNineProtocol.TableInfo;
    TableEx: InstanceType<typeof SkyNineProtocol.ShowdownSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof SkyNineProtocol.ShowdownSyncPoint.TableBetInfo>;
    Players: SkyNineProtocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof SkyNineProtocol.ShowdownSyncPoint.PlayerBetInfo>[];
    RoundOutcome: SkyNineProtocol.RoundOutcomeInfo;
    constructor(data: Uint8Array);
  }
}

export declare namespace SkyNine2Protocol {
  class BetTimeState {
    constructor(data: Uint8Array);
  }
  class BetTimeSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      BettingAreas: InstanceType<typeof SkyNine2Protocol.BetTimeSyncPoint.TableBetInfo.BettingArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof SkyNine2Protocol.BetTimeSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
    };
    Table: SkyNine2Protocol.TableInfo;
    TableEx: InstanceType<typeof SkyNine2Protocol.BetTimeSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof SkyNine2Protocol.BetTimeSyncPoint.TableBetInfo>;
    Players: SkyNine2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof SkyNine2Protocol.BetTimeSyncPoint.PlayerBetInfo>[];
    constructor(data: Uint8Array);
  }
  class TableInfo {
    Id: string;
    Sno: string;
    RoundId: number;
    MaxBet: number;
    MinBet: number;
    BetTime: number;
  }
  class PlayerInfo {
    Id: number;
    SeatId: number;
    NickName: string;
    AvatarId: string;
    GPoints: number;
    MaxBetLimit: number;
    MinBetLimit: number;
  }
  class DealingState {
    RemainingCardCount: number;
    Dices: number[];
    FirstBase: number;
    constructor(data: Uint8Array);
  }
  class DealingSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    Table: SkyNine2Protocol.TableInfo;
    TableEx: InstanceType<typeof SkyNine2Protocol.DealingSyncPoint.TableExInfo>;
    Players: SkyNine2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class EnterGameRequest {
    TableToken: string;
    TableKey: string;
    PlayerId: number;
    PlayerToken: string;
    Version: string;
  }
  class EnterGameResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class EnterGameReceipt {
    PlayerId: number;
    BetLimit: number[];
    SyncPoint: JuYouGamesProtocol.SyncPoint;
    constructor(data: Uint8Array);
  }
  class EnterGameReceiptV2 {
    PlayerInfo: SkyNine2Protocol.PlayerInfo;
    constructor(data: Uint8Array);
  }
  class ExitGameReceipt {
    PlayerId: number;
    Reason: number;
    constructor(data: Uint8Array);
  }
  class GetTrendChartRequest {
    TableToken: string;
  }
  class GetTrendChartResponse {
    static RoundOutcome = class {
      static HandArea = class {
        Id: number;
        HandType: string;
        Outcome: number;
      };
      RoundId: number;
      HandAreas: InstanceType<typeof SkyNine2Protocol.GetTrendChartResponse.RoundOutcome.HandArea>[];
    };
    static Record = class {
      Id: number;
      Wins: number;
      Losses: number;
      Ties: number;
    };
    RoundsOutcome: InstanceType<typeof SkyNine2Protocol.GetTrendChartResponse.RoundOutcome>[];
    Records: InstanceType<typeof SkyNine2Protocol.GetTrendChartResponse.Record>[];
    DealtCards: number[];
    constructor(data: Uint8Array);
  }
  class HandInfo {
    static Hand = class {
      Type: string;
      Cards: number[];
      SortedCards: number[];
    };
    FrontHand: InstanceType<typeof SkyNine2Protocol.HandInfo.Hand>;
    BackHand: InstanceType<typeof SkyNine2Protocol.HandInfo.Hand>;
  }
  class IdleSyncPoint {
    Table: SkyNine2Protocol.TableInfo;
    Players: SkyNine2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class PlaceBetRequest {
    TableToken: string;
    AreaId: number;
    BetAmount: number;
    AllCredits: number[];
  }
  class PlaceBetResponse {
    ErrorCode: number;
    constructor(data: Uint8Array);
  }
  class PlaceBetReceipt {
    PlayerId: number;
    AreaId: number;
    BetAmount: number;
    BetCredits: number[];
    BetLimit: number[];
    constructor(data: Uint8Array);
  }
  class RoundOutcomeInfo {
    static DealerBetOutcomeInfo = class {
      TotalAmount: number;
    };
    static PlayerBetOutcomeInfo = class {
      static BettingArea = class {
        Id: number;
        Amount: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof SkyNine2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo.BettingArea>[];
      TotalAmount: number;
      GPoints: number;
    };
    DealerBetOutcome: InstanceType<typeof SkyNine2Protocol.RoundOutcomeInfo.DealerBetOutcomeInfo>;
    PlayersBetOutcome: InstanceType<typeof SkyNine2Protocol.RoundOutcomeInfo.PlayerBetOutcomeInfo>[];
  }
  class RoundStartState {
    Sno: string;
    RoundId: number;
    constructor(data: Uint8Array);
  }
  class RoundStartSyncPoint {
    Table: SkyNine2Protocol.TableInfo;
    Players: SkyNine2Protocol.PlayerInfo[];
    constructor(data: Uint8Array);
  }
  class ShowdownState {
    static HandArea = class {
      Id: number;
      Hand: any;
      Outcome: number;
      FrontOutcome: number;
      BackOutcome: number;
    };
    HandAreas: InstanceType<typeof SkyNine2Protocol.ShowdownState.HandArea>[];
    RoundOutcome: SkyNine2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
  class ShowdownSyncPoint {
    static TableExInfo = class {
      RemainingCardCount: number;
      Dices: number[];
      FirstBase: number;
    };
    static TableBetInfo = class {
      static BettingArea = class {
        Id: number;
        TotalBet: number;
        BetLimit: number;
      };
      static HandArea = class {
        Id: number;
        Hand: any;
        Outcome: number;
        FrontOutcome: number;
        BackOutcome: number;
      };
      BettingAreas: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.TableBetInfo.BettingArea>[];
      HandAreas: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.TableBetInfo.HandArea>[];
    };
    static PlayerBetInfo = class {
      static BettingArea = class {
        Id: number;
        AllBets: number[];
        TotalBet: number;
      };
      Id: number;
      BettingAreas: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.PlayerBetInfo.BettingArea>[];
      TotalBet: number;
    };
    Table: SkyNine2Protocol.TableInfo;
    TableEx: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.TableExInfo>;
    TableBet: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.TableBetInfo>;
    Players: SkyNine2Protocol.PlayerInfo[];
    PlayersBet: InstanceType<typeof SkyNine2Protocol.ShowdownSyncPoint.PlayerBetInfo>[];
    RoundOutcome: SkyNine2Protocol.RoundOutcomeInfo;
    Maintenance: number;
    constructor(data: Uint8Array);
  }
}

