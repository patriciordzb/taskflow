export const USERS = [
  { id: 'pato', name: 'Pato', initials: 'PA', bg: '#B5D4F4', color: '#0C447C' },
  { id: 'jose', name: 'Jose', initials: 'JO', bg: '#9FE1CB', color: '#085041' },
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
  { title: 'Setup Python pipeline for tensile analysis',  desc: 'Configure GRX810_Pipeline.py in VS Code/Anaconda',           status: 'done',       type: 'task',    priority: 'P1', assignee: 'pato', deadline: '' },
  { title: 'Prepare samples for EBSD session with Zach',  desc: 'Coordinate with lab and verify phase files in Oxford AZtec', status: 'inprogress', type: 'task',    priority: 'P1', assignee: 'pato', deadline: '' },
  { title: 'Compare E, YS, UTS across EOS machines',      desc: 'M280 M290 M400 variants vs Touchstone reference values',     status: 'inprogress', type: 'feature', priority: 'P2', assignee: 'jose', deadline: '' },
  { title: 'Review crystallographic phase files',         desc: 'Oxford AZtec software Ni FCC phase identification',          status: 'todo',       type: 'docs',    priority: 'P2', assignee: 'jose', deadline: '' },
  { title: 'DSA/serration detection script',              desc: 'Separate script for dynamic strain aging detection',         status: 'todo',       type: 'feature', priority: 'P3', assignee: 'pato', deadline: '' },
  { title: 'Fix matplotlib PDF export bug',               desc: 'Charts not rendering correctly when exporting to PDF',       status: 'backlog',    type: 'bug',     priority: 'P2', assignee: 'jose', deadline: '' },
  { title: 'NASA internal report results section',        desc: 'Write up mechanical property findings for NASA report',      status: 'review',     type: 'docs',    priority: 'P1', assignee: 'pato', deadline: '' },
]
