export type RailsFeatureProperties<L extends "station" | "section"> = {
  layer: L;
  /**
   * 事業者種別
   *
   * - "1": 新幹線(旧国鉄)
   * - "2": JR在来線(旧国鉄含む)
   * - "3": 公営鉄道
   * - "4": 民営鉄道
   * - "5": 第三セクター
   * */
  N05_001: "1" | "2" | "3" | "4" | "5";
  /**
   * 路線名
   */
  N05_002: string;
  /**
   * 運営会社
   */
  N05_003: string;
  /**
   * 供用開始年
   */
  N05_004: string;
  /**
   * 設置期間(設置開始)
   */
  N05_005b: string;
  /**
   * 設置期間(設置終了)
   *
   * 鉄道路線、駅が設置された年（西暦年）。なお、昭和25年以前に設置された場合は1950とする。鉄道路線、駅が変更・廃止された年の一年前の年（西暦年）。現存する場合は"9999"、不明な場合は"999"とする
   */
  N05_005e: string;
  /**
   * 関係ID
   *
   * 路線および駅の属性が変更された場合の同一地物である事を表すグループID（その他の情報欄に詳細を説明）
   */
  N05_006: string;
  /**
   * 駅名
   */
  N05_011: L extends "station" ? string : null;
};

export type MapState = {
  year: number;
  selectedFeature?: {
    N05_002: string;
    N05_003: string;
    N05_006: string;
  } | null;
};
