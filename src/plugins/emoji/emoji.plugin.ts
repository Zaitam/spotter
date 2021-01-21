import {
  SpotterOptionBase,
  SpotterPlugin,
  SpotterPluginLifecycle,
} from '../../core';
import { dictionary } from './emoji.dictionary';

export class EmojiPlugin extends SpotterPlugin implements SpotterPluginLifecycle {

  identifier = 'Emoji';

  onQuery(query: string): SpotterOptionBase[] {
    return Object.entries(dictionary)
      .filter(([_, synonyms]) => synonyms.find(s => s.includes(query)))
      .map(([emoji, synonyms]) => ({
        title: `:${synonyms[0]}:`,
        icon: emoji,
        subtitle: `Copy :${synonyms[0]}: to clipboard`,
        action: () => this.nativeModules.clipboard.setValue(emoji),
      }))
  }

}
