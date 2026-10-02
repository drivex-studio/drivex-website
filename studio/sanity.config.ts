import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'app-drivex',

  projectId: 'n45yjixx',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), media()],

  schema: {
    types: schemaTypes,
  },
})
