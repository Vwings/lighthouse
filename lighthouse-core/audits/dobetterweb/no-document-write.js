/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Audit a page to see if it's using document.write()
 */

'use strict';

const ViolationAudit = require('../violation-audit');

class NoDocWriteAudit extends ViolationAudit {
  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      name: 'no-document-write',
      description: '避免 `document.write()`',
      failureDescription: '使用 `document.write()`',
      helpText: '对于连接速度慢的用户，通过`document.write（）`动态注入的外部脚本可以延迟页面加载数十秒。' +
          '[了解更多](https://developers.google.com/web/tools/lighthouse/audits/document-write).',
      requiredArtifacts: ['ChromeConsoleMessages'],
    };
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    const results = ViolationAudit.getViolationResults(artifacts, /document\.write/);

    const headings = [
      {key: 'url', itemType: 'url', text: 'URL'},
      {key: 'label', itemType: 'text', text: 'Location'},
    ];
    const details = ViolationAudit.makeTableDetails(headings, results);

    return {
      rawValue: results.length === 0,
      extendedInfo: {
        value: results,
      },
      details,
    };
  }
}

module.exports = NoDocWriteAudit;
