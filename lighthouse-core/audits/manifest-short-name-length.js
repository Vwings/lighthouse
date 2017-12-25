/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('./audit');

class ManifestShortNameLength extends Audit {
  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      name: 'manifest-short-name-length',
      description: 'Manifest的 `short_name`在主屏幕上显示时不会被截断',
      failureDescription: 'Manifest的 `short_name`在主屏幕上显示时会被截断',
      helpText: '为确保您应用程序的`short_name` 在主屏幕上不被截断，请使其少于12个字符。' +
          '[了解更多](https://developers.google.com/web/tools/lighthouse/audits/manifest-short_name-is-not-truncated).',
      requiredArtifacts: ['Manifest'],
    };
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    return artifacts.requestManifestValues(artifacts.Manifest).then(manifestValues => {
      if (manifestValues.isParseFailure) {
        return {
          rawValue: false,
        };
      }

      const hasShortName = manifestValues.allChecks.find(i => i.id === 'hasShortName').passing;
      if (!hasShortName) {
        return {
          rawValue: false,
          debugString: 'No short_name found in manifest.',
        };
      }

      const isShortEnough = manifestValues.allChecks.find(i => i.id === 'shortNameLength').passing;
      return {
        rawValue: isShortEnough,
      };
    });
  }
}

module.exports = ManifestShortNameLength;
