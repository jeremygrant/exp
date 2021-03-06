/**
 * @flow
 */

import { login } from '../accounts';

export default (program: any) => {
  program
    .command('login')
    .alias('signin')
    .description('Login to Expo')
    .option('-u, --username [string]', 'Username')
    .option('-p, --password [string]', 'Password')
    .option('-t, --token [string]', 'Token')
    .option('--github', 'Login with Github')
    .allowNonInteractive()
    .asyncAction(login);
};
