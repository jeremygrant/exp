/**
 * @flow
 */

import crayon from '@ccheever/crayon';
import simpleSpinner from '@expo/simple-spinner';

import { Project } from 'xdl';

import log from '../log';
import sendTo from '../sendTo';
import { installExitHooks } from '../exit';

type Options = {
  sendTo?: string,
  quiet?: boolean,
};

export async function action(projectDir: string, options: Options = {}) {
  const status = await Project.currentStatus(projectDir);

  let startedOurOwn = false;
  if (status !== 'running') {
    log(
      'Unable to find an existing exp instance for this directory, starting a new one...'
    );
    installExitHooks(projectDir);
    await Project.startAsync(projectDir, {}, !options.quiet);
    startedOurOwn = true;
  }

  let recipient = await sendTo.getRecipient(options.sendTo);
  log('Publishing...');

  if (options.quiet) {
    simpleSpinner.start();
  }

  let result = await Project.publishAsync(projectDir);

  if (options.quiet) {
    simpleSpinner.stop();
  }

  log('Published');
  log('Your URL is\n\n' + crayon.underline(result.url) + '\n');
  log.raw(result.url);

  if (recipient) {
    await sendTo.sendUrlAsync(result.url, recipient);
  }

  if (startedOurOwn) {
    await Project.stopAsync(projectDir);
  }

  return result;
}

export default (program: any) => {
  program
    .command('publish [project-dir]')
    .alias('p')
    .description('Publishes your project to exp.host')
    .option(
      '-q, --quiet',
      'Suppress verbose output from the React Native packager.'
    )
    .option(
      '-s, --send-to [dest]',
      'A phone number or e-mail address to send a link to'
    )
    .allowNonInteractive()
    .asyncActionProjectDir(action, true);
};
