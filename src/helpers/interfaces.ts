export interface IProject {
  title: string;
  description: string;
  impact?: string;
  image: string;
  links: {
    demo: string;
    blog: string;
  };
  meta: {
    category: string[];
    date: string;
    stack: string[];
  };
}

export interface IProfile {
  name: string;
  employer: string;
  title: string;
  subtitle?: string;
  blog: {
    name: string;
    url: string;
  };
  lead: string;
  about: string[];
}

export interface IResumeEducation {
  school: string;
  degree: string;
  honors?: string;
}

export interface IResumeExperience {
  title: string;
  company: string;
  location: string;
  dates: string;
  desc: string[];
}

export interface IResume {
  summary: string;
  experience: IResumeExperience[];
  education?: IResumeEducation;
}

export interface IProduct {
  title: string;
  description: string;
  image: string;
  links: {
    demo: string;
    blog: string;
  };
  featured: boolean;
}

export interface IPost {
  title: string;
  image: string;
  date: string;
  link: string;
  featured: string;
}

export interface IHelperLinks {
  [key: string]: {
    url: string;
    text: string;
  };
}

export interface IEveAction {
  label: string;
  url: string;
  type: 'demo' | 'blog' | 'resume' | 'contact' | 'external';
}

export type IMouseEvents = (event: React.MouseEvent<HTMLDivElement>) => void;

export interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
