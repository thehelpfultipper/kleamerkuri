export interface IProject {
  title: string;
  description: string;
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
  blog: {
    name: string;
    url: string;
  };
  lead: string;
  about: string[];
}

export interface IResumeExperience {
  title: string;
  company: string;
  location: string;
  dates: string;
  desc: {
    action: string;
    support: string[];
  }[];
}

export interface IResume {
  summary: string;
  experience: IResumeExperience[];
}

export interface IProduct {
  title: string;
  description: string;
  image: string;
  links: {
    demo: string;
    blog: string;
  };
}

export interface IPost {
  title: string;
  image: string;
  date: string;
  link: string;
}

export interface IHelperLinks {
  [key: string]: {
    url: string;
    text: string;
  };
}

export type IMouseEvents = (event: React.MouseEvent<HTMLDivElement>) => void;
