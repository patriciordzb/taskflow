export const USERS = [
  { id: 'pato', name: 'Pato',  initials: 'PA', bg: '#B5D4F4', color: '#0C447C' },
  { id: 'jose', name: 'Jose',  initials: 'JO', bg: '#9FE1CB', color: '#085041' },
  { id: 'ana',  name: 'Ana',   initials: 'AN', bg: '#F5C4B3', color: '#712B13' },
]

export const COLUMNS = [
  { id: 'backlog',    label: 'Backlog',      dot: '#888780' },
  { id: 'todo',       label: 'To Do',        dot: '#185FA5' },
  { id: 'inprogress', label: 'In Progress',  dot: '#EF9F27' },
  { id: 'review',     label: 'Review',       dot: '#D4537E' },
  { id: 'done',       label: 'Done',         dot: '#639922' },
]

export const TASK_TYPES = {
  bug:     { label: 'Bug',     cls: 'tag-bug'  },
  feature: { label: 'Feature', cls: 'tag-feat' },
  task:    { label: 'Task',    cls: 'tag-task' },
  docs:    { label: 'Docs',    cls: 'tag-docs' },
}

export const PRIORITIES = {
  P1: { label: 'P1', icon: '🔴' },
  P2: { label: 'P2', icon: '🟠' },
  P3: { label: 'P3', icon: '🟡' },
}

export const DEFAULT_TASKS = [
  { id:'TF-001', title:'Setup Python pipeline for tensile analysis', status:'done',       type:'task',    priority:'P1', assignee:'pato', desc:'Configure GRX810_Pipeline.py in VS Code/Anaconda' },
  { id:'TF-002', title:'Prepare samples for EBSD session with Zach', status:'inprogress', type:'task',    priority:'P1', assignee:'pato', desc:'Coordinate with lab, verify phase files in Oxford AZtec' },
  { id:'TF-003', title:'Compare E, YS, UTS across EOS machines',     status:'inprogress', type:'feature', priority:'P2', assignee:'jose', desc:'M280, M290, M400 variants vs Touchstone reference values' },
  { id:'TF-004', title:'Review crystallographic phase files',         status:'todo',       type:'docs',    priority:'P2', assignee:'ana',  desc:'Oxford AZtec software – Ni FCC phase identification' },
  { id:'TF-005', title:'DSA/serration detection script',              status:'todo',       type:'feature', priority:'P3', assignee:'pato', desc:'Separate script for dynamic strain aging detection' },
  { id:'TF-006', title:'Fix matplotlib PDF export bug',               status:'backlog',    type:'bug',     priority:'P2', assignee:'jose', desc:'Charts not rendering correctly when exporting to PDF' },
  { id:'TF-007', title:'NASA internal report – results section',      status:'review',     type:'docs',    priority:'P1', assignee:'ana',  desc:'Write up mechanical property findings for NASA report' },
]
