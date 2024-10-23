export class M_Scene {
  //singleton
  private static instance: M_Scene;
  static getInstance() {
    if (!M_Scene.instance) {
      M_Scene.instance = new M_Scene();
    }
    return M_Scene.instance;
  }

  width: number = 30;
  height: number = 300;

  constructor() {}


}