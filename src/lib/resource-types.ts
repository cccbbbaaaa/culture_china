export type ResourceSection = "activities" | "curriculum" | "admissions" | "stories";

interface ResourceTypeConfig {
  /**
   * 页面板块标识 / Section identifier
   */
  section: ResourceSection;
  /**
   * 在 UI 中显示的标签文案 / Label used in UI
   */
  label: string;
}

/**
 * 公众号推文类型映射
 * Mapping from raw CSV type to UI presentation and section routing.
 */
export const RESOURCE_TYPE_MAP: Record<string, ResourceTypeConfig> = {
  "活动-年度论坛": { section: "activities", label: "年度论坛" },
  "活动-访学交流": { section: "activities", label: "访学交流" },
  "活动-其他活动": { section: "activities", label: "其他活动" },
  "招生-招生活动": { section: "admissions", label: "招生活动" },
  "课程-课程回顾/新闻场记": { section: "curriculum", label: "课程回顾 · Notes" },
  "校友故事/随笔/专栏": { section: "stories", label: "校友故事" },
};

export const getResourceTypeLabel = (type: string | null | undefined) => {
  if (!type) return null;
  return RESOURCE_TYPE_MAP[type]?.label ?? type;
};

export const getTypesBySection = (section: ResourceSection) =>
  Object.entries(RESOURCE_TYPE_MAP)
    .filter(([, config]) => config.section === section)
    .map(([type]) => type);


