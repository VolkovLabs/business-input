// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

import { TextDecoder, TextEncoder } from 'util';
import { TransformStream, ReadableStream, WritableStream } from 'stream/web';

/**
 * Assign Web Streams API which are required in @grafana/ui
 */
Object.assign(global, { TransformStream, ReadableStream, WritableStream });

/**
 * Assign Text Decoder and Encoder which are required in @grafana/ui
 */
Object.assign(global, { TextDecoder, TextEncoder });
