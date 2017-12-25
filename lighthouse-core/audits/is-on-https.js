/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit');
const URL = require('../lib/url-shim');
const Util = require('../report/v2/renderer/util');

const SECURE_SCHEMES = ['data', 'https', 'wss', 'blob', 'chrome', 'chrome-extension'];
const SECURE_DOMAINS = ['localhost', '127.0.0.1'];

class HTTPS extends Audit {
  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      name: 'is-on-https',
      description: '使用 HTTPS',
      failureDescription: '不使用 HTTPS',
      helpText: '所有网站都应使用HTTPS来进行保护，即便是那些不处理敏感数据的网站。' +
          'HTTPS可以防止入侵者篡改或被动地监听应用程序和用户之间的通信，是HTTP/2和许多新的Web平台API的先决条件。' +
          '[了解更多](https://developers.google.com/web/tools/lighthouse/audits/https).',
      requiredArtifacts: ['devtoolsLogs'],
    };
  }

  /**
   * @param {{scheme: string, domain: string}} record
   * @return {boolean}
   */
  static isSecureRecord(record) {
    return SECURE_SCHEMES.includes(record.scheme) ||
           SECURE_SCHEMES.includes(record.protocol) ||
           SECURE_DOMAINS.includes(record.domain);
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    const devtoolsLogs = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    return artifacts.requestNetworkRecords(devtoolsLogs).then(networkRecords => {
      const insecureRecords = networkRecords
          .filter(record => !HTTPS.isSecureRecord(record))
          .map(record => ({url: URL.elideDataURI(record.url)}));

      let displayValue = '';
      if (insecureRecords.length > 1) {
        displayValue = `${Util.formatNumber(insecureRecords.length)} insecure requests found`;
      } else if (insecureRecords.length === 1) {
        displayValue = `${insecureRecords.length} insecure request found`;
      }

      return {
        rawValue: insecureRecords.length === 0,
        displayValue,
        extendedInfo: {
          value: insecureRecords,
        },
        details: {
          type: 'list',
          header: {type: 'text', text: 'Insecure URLs:'},
          items: insecureRecords.map(record => ({type: 'url', text: record.url})),
        },
      };
    });
  }
}

module.exports = HTTPS;
