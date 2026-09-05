export type ViewScriptRuntime = {
  reducedMotion: boolean;
};

export type ViewScriptHandler = (runtime: ViewScriptRuntime) => void;

export type ViewScriptRegistration = {
  handler: ViewScriptHandler;
};
