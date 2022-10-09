import { Button, Card, Flex, Forms, Inputs } from '@hykord/components';
import { ErrorBoundary } from '@hykord/components/ErrorBoundary';
import { loadQuickCss } from '@loader/theme';
import { shell } from 'electron';
import { quickCss } from '../../utils';

export default ErrorBoundary.wrap(() => {
  return (
    <>
      <Forms.FormSection tag="h1" title="Hykord">
        <Forms.FormSection>
        <Card
            className="hykord-card"
            type={Card.Types.PRIMARY}
            body={
              <>
                <Flex
                  style={{
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Forms.FormText>Directory: {Hykord.directory}</Forms.FormText>
                    <Forms.FormText>Version: {Hykord.version}</Forms.FormText>
                    <Forms.FormText>Git hash: {Hykord.gitHash}</Forms.FormText>
                  </div>
                  <div style={{
                    display: 'grid',
                    gap: '10px'
                  }}>
                    <Button
                      color={Button.Colors.BRAND_NEW}
                      size={Button.Sizes.TINY}
                      look={Button.Looks.FILLED}
                      onClick={() => shell.openPath(Hykord.directory)}
                    >
                      Open Folder
                    </Button>
                    <Button
                      color={Button.Colors.YELLOW}
                      size={Button.Sizes.TINY}
                      look={Button.Looks.FILLED}
                      onClick={() => HykordNative.relaunchApp()}
                    >
                      Restart
                    </Button>
                  </div>
                </Flex>
              </>
            }
          />
          <br />
          <Forms.FormTitle>Options</Forms.FormTitle>
          <Inputs.Switch
            value={HykordNative.getManagers()
              .getSettings()
              .getSync('hykord.quick-css', false)}
            note={'Allows you to use QuickCSS'}
            onChange={async (value: boolean) => {
              if (value) await loadQuickCss();
              else quickCss.unload();

              return HykordNative.getManagers()
                .getSettings()
                .set('hykord.quick-css', value);
            }}
            label="Use QuickCss"
          />
          {/* // TODO: ADD REQUIRE RESTART MODAL */}
          <Inputs.Switch
            value={HykordNative.getManagers()
              .getSettings()
              .getSync('hykord.disable-science-requests', false)}
            note={"Disable discord's science requests and tracking"}
            onChange={(value: boolean) =>
              HykordNative.getManagers()
                .getSettings()
                .set('hykord.disable-science-requests', value)
            }
            label="Disable science requests"
          />
          <Inputs.Switch
            value={HykordNative.getManagers()
              .getSettings()
              .getSync('hykord.react-devtools', false)}
            note={'Allows you to use react devtools'}
            onChange={(value: boolean) =>
              HykordNative.getManagers()
                .getSettings()
                .set('hykord.react-devtools', value)
            }
            label="Enable React DevTools"
          />
          <Inputs.Switch
            value={HykordNative.getManagers()
              .getSettings()
              .getSync('hykord.unsafe-require', false)}
            note={'Allows you to require any installed module'}
            onChange={(value: boolean) =>
              HykordNative.getManagers()
                .getSettings()
                .set('hykord.unsafe-require', value)
            }
            label="Enable unsafe require"
          />
        </Forms.FormSection>
      </Forms.FormSection>
    </>
  );
});
