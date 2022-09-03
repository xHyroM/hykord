import { React, findByDisplayName } from "@hykord/webpack";

export class BooleanItem extends React.Component {
    constructor (props) {
        super(props);

        this.toggle = props.toggle;
        this.postHandle = props.postHandle;
        this.value = props.value;
        this.disabled = props.disabled;
        
        this.state = {
            value: this.value
        }

        this.handleChange = this.handleChange.bind(this);
    }
  
    async handleChange() {
        const value = await this.toggle();

        this.setState({
            value: value
        });

        this.postHandle?.();
    }
  
    render () {
        const Switch = findByDisplayName("Switch");
        const FormItem = findByDisplayName("FormItem");

        return (
            <FormItem>
                <Switch
                    disabled={this.disabled}
                    checked={this.state.value}
                    onChange={this.handleChange}
                />
            </FormItem>
        )
    }
}