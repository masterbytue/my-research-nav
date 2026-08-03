import type { ResourceCategory, SearchEngine } from '@/types/navigation'

export const searchEngines: SearchEngine[] = [
  { id: 'scholar', name: 'Google Scholar', searchUrl: 'https://scholar.google.com/scholar?q=' },
  { id: 'cnki', name: '中国知网', searchUrl: 'https://kns.cnki.net/kns8/defaultresult/index?kwd=' },
  { id: 'wanfang', name: '万方数据', searchUrl: 'https://s.wanfangdata.com.cn/paper?q=' },
  { id: 'semantic', name: 'Semantic Scholar', searchUrl: 'https://www.semanticscholar.org/search?q=' },
  { id: 'pubmed', name: 'PubMed', searchUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=' },
]

export const categories: ResourceCategory[] = [
  {
    id: 'ai',
    label: 'AI 研究助手',
    index: '01',
    description: '从思路发散、代码协作到长文档阅读。',
    resources: [
      { id: 'chatgpt', name: 'ChatGPT', description: '通用研究与推理助手', url: 'https://chatgpt.com', tags: ['AI', '写作'], accent: '#2f6b5c', featured: true },
      { id: 'deepseek', name: 'DeepSeek', description: '中文推理与代码辅助', url: 'https://chat.deepseek.com', tags: ['AI', '推理'], accent: '#3157a4', featured: true },
      { id: 'gemini', name: 'Gemini', description: 'Google 多模态研究助手', url: 'https://gemini.google.com', tags: ['AI', '多模态'], accent: '#8b5b3f' },
      { id: 'qwen', name: '通义千问', description: '长文档与中文内容处理', url: 'https://tongyi.aliyun.com', tags: ['AI', '中文'], accent: '#6c55a3' },
      { id: 'notebooklm', name: 'NotebookLM', description: '基于资料来源的阅读笔记', url: 'https://notebooklm.google.com', tags: ['AI', '阅读'], accent: '#356d83' },
    ],
  },
  {
    id: 'literature',
    label: '文献检索',
    index: '02',
    description: '覆盖中文数据库、国际引文与生命科学。',
    resources: [
      { id: 'cnki', name: '中国知网', description: '中文期刊与学位论文', url: 'https://www.cnki.net', tags: ['中文', '数据库'], accent: '#9b4b3d', featured: true },
      { id: 'wanfang', name: '万方数据', description: '中文期刊、会议与标准', url: 'https://www.wanfangdata.com.cn', tags: ['中文', '数据库'], accent: '#315f89' },
      { id: 'wos', name: 'Web of Science', description: '国际核心引文索引', url: 'https://www.webofscience.com', tags: ['引文', '国际'], accent: '#6d4585', featured: true },
      { id: 'scholar', name: 'Google Scholar', description: '跨学科学术搜索', url: 'https://scholar.google.com', tags: ['检索', '国际'], accent: '#3d6f57' },
      { id: 'pubmed', name: 'PubMed', description: '生物医学文献数据库', url: 'https://pubmed.ncbi.nlm.nih.gov', tags: ['医学', '生命科学'], accent: '#4777a8' },
      { id: 'semantic-scholar', name: 'Semantic Scholar', description: 'AI 驱动的论文检索与脉络', url: 'https://www.semanticscholar.org', tags: ['检索', '引文'], accent: '#1f6f78' },
    ],
  },
  {
    id: 'open-access',
    label: '开放获取',
    index: '03',
    description: '寻找合法、开放且可复用的研究成果。',
    resources: [
      { id: 'arxiv', name: 'arXiv', description: '理工科开放预印本', url: 'https://arxiv.org', tags: ['预印本', '开放获取'], accent: '#a04444', featured: true },
      { id: 'openalex', name: 'OpenAlex', description: '开放的全球学术知识图谱', url: 'https://openalex.org', tags: ['开放数据', '引文'], accent: '#356858' },
      { id: 'doaj', name: 'DOAJ', description: '开放获取期刊目录', url: 'https://doaj.org', tags: ['期刊', '开放获取'], accent: '#8a6237' },
      { id: 'core', name: 'CORE', description: '开放论文与机构仓储聚合', url: 'https://core.ac.uk', tags: ['全文', '开放获取'], accent: '#75502f' },
      { id: 'unpaywall', name: 'Unpaywall', description: '查找论文的开放合法版本', url: 'https://unpaywall.org', tags: ['全文', '浏览器工具'], accent: '#378153' },
    ],
  },
  {
    id: 'reading',
    label: '阅读与管理',
    index: '04',
    description: '把零散文献变成可检索的个人知识库。',
    resources: [
      { id: 'zotero', name: 'Zotero', description: '开源文献管理与引用', url: 'https://www.zotero.org', tags: ['文献管理', '引用'], accent: '#a33f3f', featured: true },
      { id: 'researchrabbit', name: 'ResearchRabbit', description: '用关系图发现相关论文', url: 'https://www.researchrabbit.ai', tags: ['文献发现', '可视化'], accent: '#603c8c' },
      { id: 'connected-papers', name: 'Connected Papers', description: '探索论文之间的关联网络', url: 'https://www.connectedpapers.com', tags: ['引文', '可视化'], accent: '#3b667f' },
      { id: 'obsidian', name: 'Obsidian', description: '本地优先的研究笔记', url: 'https://obsidian.md', tags: ['笔记', '知识库'], accent: '#7451a6' },
    ],
  },
  {
    id: 'writing',
    label: '写作与表达',
    index: '05',
    description: '论文撰写、语言润色、翻译与协作。',
    resources: [
      { id: 'overleaf', name: 'Overleaf', description: '在线 LaTeX 协作写作', url: 'https://www.overleaf.com', tags: ['LaTeX', '协作'], accent: '#3f7d4e', featured: true },
      { id: 'deepl', name: 'DeepL', description: '高质量学术语言翻译', url: 'https://www.deepl.com/translator', tags: ['翻译', '语言'], accent: '#234c8a' },
      { id: 'languagetool', name: 'LanguageTool', description: '多语言语法与风格检查', url: 'https://languagetool.org', tags: ['校对', '语言'], accent: '#4673b6' },
      { id: 'writefull', name: 'Writefull', description: '面向学术英语的写作反馈', url: 'https://www.writefull.com', tags: ['学术写作', '英语'], accent: '#765193' },
    ],
  },
  {
    id: 'analysis',
    label: '数据与绘图',
    index: '06',
    description: '从数据清洗、统计计算到结果表达。',
    resources: [
      { id: 'jupyter', name: 'Jupyter', description: '交互式计算与可复现分析', url: 'https://jupyter.org', tags: ['Python', '分析'], accent: '#c16a2b', featured: true },
      { id: 'origin', name: 'OriginLab', description: '科研数据分析与绘图', url: 'https://www.originlab.com', tags: ['绘图', '统计'], accent: '#a55031' },
      { id: 'r-project', name: 'R Project', description: '统计计算与数据科学', url: 'https://www.r-project.org', tags: ['R', '统计'], accent: '#416e9a' },
      { id: 'observable', name: 'Observable', description: '交互式数据可视化笔记本', url: 'https://observablehq.com', tags: ['可视化', 'JavaScript'], accent: '#455266' },
    ],
  },
  {
    id: 'publishing',
    label: '期刊与专利',
    index: '07',
    description: '选刊、分区、专利检索与科研社区。',
    resources: [
      { id: 'letpub', name: 'LetPub', description: 'SCI 选刊与期刊信息', url: 'https://www.letpub.com.cn', tags: ['选刊', '期刊'], accent: '#2f7183', featured: true },
      { id: 'jcr', name: 'Journal Citation Reports', description: '期刊引证与影响力分析', url: 'https://jcr.clarivate.com', tags: ['期刊', '引文'], accent: '#60427e' },
      { id: 'google-patents', name: 'Google Patents', description: '全球专利全文检索', url: 'https://patents.google.com', tags: ['专利', '检索'], accent: '#3f6e55' },
      { id: 'espacenet', name: 'Espacenet', description: '欧洲专利局全球专利库', url: 'https://worldwide.espacenet.com', tags: ['专利', '国际'], accent: '#326aa1' },
      { id: 'muchong', name: '小木虫', description: '科研经验与学术交流社区', url: 'https://muchong.com', tags: ['社区', '经验'], accent: '#8e552f' },
    ],
  },
]

export const allResources = categories.flatMap((category) => category.resources)
