import { SpotterOption, SpotterPlugin, SpotterQuery } from '../core/shared';

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

export default class Timer extends SpotterPlugin implements SpotterQuery {

  timer: NodeJS.Timeout | null = null;

  presets: SpotterOption[] = [
    {
      title: 't 1h',
      subtitle: 'Set a timer for an hour',
      action: () => null,
      image: '',
    }
  ];

  query(query: string): SpotterOption[] {

    if (query.toLowerCase().startsWith('t')) {
      const timeQuery = query.split(' ')[1];

      if (timeQuery) {
        const time = this.parseTimeQuery(timeQuery);
        const timeSubtile = this.getSubtitle(time);
        const seconds = this.getSeconds(time);

        return [{
          title: `t ${timeQuery}`,
          subtitle: `Set a timer for ${timeSubtile}`,
          action: () => this.setTimer(seconds),
          image: '',
        }]
      }

      return this.presets;
    }

    return [];
  }

  private setTimer(seconds: number) {
    let counter = seconds;
    this.resetTimer();

    this.timer = setInterval(() => {
      if (!counter) {
        this.resetTimer();
        this.notifications.show('Complete', `Timer for ${seconds} seconds has been completed`)
        this.statusBar.changeTitle('');
        return;
      }

      this.statusBar.changeTitle(`${counter--}`)
    }, 1000)
  }

  private resetTimer() {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer)
  }

  private getSubtitle(time: Time): string {
    const timeLabel = time.hours
      ? `${time.hours} hour(s)`
      : time.minutes
        ? `${time.minutes} minute(s)`
        : time.seconds
          ? `${time.seconds} second(s)`
          : '';

    return timeLabel;
  }

  private parseTimeQuery(timeQuery: string): Time {
    const hours = timeQuery.match(/(\d+)\s*h/);
    const minutes = timeQuery.match(/(\d+)\s*m/);
    const seconds = timeQuery.match(/(\d+)\s*s/);
    return {
      hours: hours ? parseInt(hours[1]) : 0,
      minutes: minutes ? parseInt(minutes[1]) : 0,
      seconds: seconds ? parseInt(seconds[1]) : 0,
    };
  }

  private getSeconds(time: Time): number {
    let seconds = time.seconds ?? 0;
    if (time.hours) { seconds += time.hours * 3600; }
    if (time.minutes) { seconds += time.minutes * 60; }
    return seconds;
  }

}