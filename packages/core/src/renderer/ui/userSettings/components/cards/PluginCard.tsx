import { React } from '@hykord/webpack';
import { BooleanItem } from '@hykord/components/items'
import { Card, Flex, Markdown, FormText, ErrorBoundary, FormDivider } from '@hykord/components';

export default class extends React.Component {
  constructor (props) {
    super(props);

    this.plugins = window.hykord.plugins;
    this.plugin = this.plugins.getPlugin(props.pluginName);
  }

  render() {
    return (
        <ErrorBoundary>
          <Card className="hykord-card">
            <Flex justify={Flex.Justify.BETWEEN} align={Flex.Align.CENTER}>
              <FormText tag="h5">
                <strong>{this.plugin.name}</strong>{this.plugin.author ? <> by <strong>{this.plugin.author || '-'}</strong></> : null }
              </FormText>

              <BooleanItem
                    toggle={() => this.plugins.togglePlugin(this.plugin)}
                    disabled={this.plugin.broken}
                    value={this.plugin.enabled}
                />
            </Flex>
            <Markdown>{this.plugin.description || 'Good days, bad days.'}</Markdown>
            <FormDivider className='hykord-form-divider' />
            <FormText>Version: {this.plugin.version || '?.?.?'}</FormText>
            <FormText>License: {this.plugin.license || '???'}</FormText>
          </Card>
        </ErrorBoundary>
    )
  }
}