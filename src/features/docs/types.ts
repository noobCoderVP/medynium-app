export interface DocTopic {
  title: string;
  body: string;
}

export interface DocSection {
  id: string;
  title: string;
  summary: string;
  topics: DocTopic[];
}
