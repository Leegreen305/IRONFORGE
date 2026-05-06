export interface DoctrineCitation {
  pub: string
  paragraph: string
  title: string
  url?: string
}

export interface METTTC {
  mission: string
  enemy: string
  terrain_and_weather: string
  troops_and_support_available: string
  time_available: string
  civil_considerations: string
}

export interface ReceiptOfMissionResult {
  step_name: string
  mission_type: string
  classification: string
  time_available_hours: number | null
  initial_assessment: string
  key_tasks_identified: string[]
  citations: DoctrineCitation[]
}

export interface MissionAnalysisResult {
  step_name: string
  mett_tc: METTTC
  specified_tasks: string[]
  implied_tasks: string[]
  essential_tasks: string[]
  restated_mission: string
  commander_intent_summary: string | null
  planning_guidance: string | null
  citations: DoctrineCitation[]
}

export interface COA {
  coa_id: string
  name: string
  description: string
  type: string
  decisive_operation: string
  shaping_operations: string[]
  sustaining_operation: string | null
  risk_assessment: string
  status: string
  citations: DoctrineCitation[]
}

export interface WargameSequence {
  sequence_num: number
  friendly_action: string
  enemy_reaction: string
  friendly_counteraction: string
  outcome: string
  key_decision: string | null
}

export interface COAAnalysisResult {
  step_name: string
  coa_id: string
  wargame_sequences: WargameSequence[]
  strengths: string[]
  weaknesses: string[]
  hazards: string[]
  branches: string[]
  sequels: string[]
  overall_assessment: string
  citations: DoctrineCitation[]
}

export interface CriterionScore {
  criterion: string
  raw_score: number
  weight: number
  weighted_score: number
  rationale: string
}

export interface COAComparisonResult {
  step_name: string
  coa_id: string
  scores: CriterionScore[]
  total_score: number
  rank: number
  citations: DoctrineCitation[]
}

export interface COAApprovalResult {
  step_name: string
  recommended_coa_id: string
  recommended_coa_name: string
  justification: string
  risk_acceptance: string
  decision_criteria_summary: string
  citations: DoctrineCitation[]
}

export interface OPORDParagraph {
  paragraph_num: string
  title: string
  text: string
}

export interface OPORDFragment {
  step_name: string
  situation: OPORDParagraph[]
  mission: OPORDParagraph[]
  execution: OPORDParagraph[]
  sustainment: OPORDParagraph[]
  command_and_signal: OPORDParagraph[]
  citations: DoctrineCitation[]
}

export interface MDMPOutput {
  run_id: string
  receipt: ReceiptOfMissionResult
  mission_analysis: MissionAnalysisResult
  coas: COA[]
  coa_analyses: COAAnalysisResult[]
  coa_comparisons: COAComparisonResult[]
  approval: COAApprovalResult
  opord: OPORDFragment
}

export interface ScenarioListEntry {
  [key: string]: string
}

export type MDMPStepStatus = 'pending' | 'active' | 'complete'

export interface MDMPStepInfo {
  id: number
  key: string
  label: string
  docRef: string
  status: MDMPStepStatus
}
