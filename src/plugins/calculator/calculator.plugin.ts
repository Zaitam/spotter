import Mexp from 'math-expression-evaluator';
import { SpotterOptionBase, SpotterPlugin, SpotterPluginLifecycle } from '../../core';
import icon from './icon.png';

export class CalculatorPlugin extends SpotterPlugin implements SpotterPluginLifecycle {

  identifier = 'Calculator';

  onQuery(query: string): SpotterOptionBase[] {
    const isMathExpression = (/(?:[0-9-+*/^()x]|abs|e\^x|ln|log|a?(?:sin|cos|tan)h?)+/).test(query);

    if (!isMathExpression) {
      return [];
    }

    try {
      const result = Mexp.eval(query).toString();

      if (!result || result === query) {
        return [];
      }

      return [{
        title: result,
        subtitle: `Copy to ${result} clipboard`,
        icon,
        action: () => this.copyToClipboard(result),
      }];
    } catch (_) {
      return [];
    }
  }

  private copyToClipboard(value: string) {
    this.nativeModules.clipboard.setValue(value);
  }

}
