import {
  NativeModules,
} from 'react-native';
import { SpotterApi, SystemApplication } from '../shared';

export default class Api implements SpotterApi {
  private shell = NativeModules.Shell;
  private applications = NativeModules.Applications;

  /** SHELL */

  shellCommand(command: string): void {
    this.shell.execute(command);
  }

  /** APPLICATIONS */

  async getAllApplications(): Promise<SystemApplication[]> {
    return await this.applications.getAll();
  }

  openApplication(path: string): void {
    this.applications.open(path);
  }

  setDimensions(
    appName: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this.applications.setDimensions(
      appName,
      x.toString(),
      y.toString(),
      width.toString(),
      height.toString(),
    );
  }

  async getAllDimensions() {
    return await this.applications.getAllDimensions()
  }

}
