/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit');

class PasswordInputsCanBePastedIntoAudit extends Audit {
  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      name: 'password-inputs-can-be-pasted-into',
      description: '允许用户粘贴到密码字段',
      failureDescription: '防止用户粘贴到密码字段',
      helpText: '防止密码粘贴削弱了良好的安全策略。' +
          '[了解更多](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords)',
      requiredArtifacts: ['PasswordInputsWithPreventedPaste'],
    };
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    const passwordInputsWithPreventedPaste = artifacts.PasswordInputsWithPreventedPaste;

    return {
      rawValue: passwordInputsWithPreventedPaste.length === 0,
      extendedInfo: {
        value: passwordInputsWithPreventedPaste,
      },
      details: {
        type: 'list',
        header: {
          type: 'text',
          text: 'Password inputs that prevent pasting into',
        },
        items: passwordInputsWithPreventedPaste.map(input => ({
          type: 'text',
          text: input.snippet,
        })),
      },
    };
  }
}

module.exports = PasswordInputsCanBePastedIntoAudit;
