// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi (nonso.earn@gmail.com)
// Project: notilificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

class appConfig {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:4000', //My device emulator ip
  );
}
