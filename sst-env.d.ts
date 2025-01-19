/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "Backend": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "Bucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "Database": {
      "token": string
      "type": "sst.sst.Linkable"
      "url": string
    }
    "Site": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}