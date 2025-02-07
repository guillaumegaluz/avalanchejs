/**
* @packageDocumentation
* @module Common-JRPCAPI
*/

import { AxiosRequestConfig } from "axios"
import AvalancheCore from "../avalanche"
import { APIBase, RequestResponseData } from "./apibase"

export class JRPCAPI extends APIBase {
  protected jrpcVersion: string = "2.0"
  protected rpcid = 1

  callMethod = async (
    method: string,
    params?: object[] | object,
    baseurl?:string,
    headers?: object
  ): Promise<RequestResponseData> => {
    const ep: string = baseurl || this.baseurl
    const rpc: any = {}
    rpc.id = this.rpcid
    rpc.method = method

    // Set parameters if exists
    if (params) {
      rpc.params = params
    } else if (this.jrpcVersion === "1.0") {
      rpc.params = []
    }

    if (this.jrpcVersion !== "1.0") {
      rpc.jsonrpc = this.jrpcVersion
    }

    let headrs: object = { "Content-Type": "application/jsoncharset=UTF-8" }
    if(headers) {
      headrs = { ...headrs, ...headers }
    }

    let baseURL: string = `${this.core.getProtocol()}://${this.core.getHost()}`
    const port: number = this.core.getPort()
    if (port != undefined && typeof port === "number" && port >= 0) {
      baseURL = `${baseURL}:${port}`
    }

    const axConf:AxiosRequestConfig = {
      baseURL: baseURL,
      responseType: "json",
    }

    const resp: RequestResponseData = await this.core.post(ep, {}, JSON.stringify(rpc), headrs, axConf)
    if (resp.status >= 200 && resp.status < 300) {
      this.rpcid += 1
      if (typeof resp.data === "string") {
        resp.data = JSON.parse(resp.data)
      }
      if (typeof resp.data === "object" && (resp.data === null || "error" in resp.data)) {
        throw new Error(resp.data.error.message)
      }
    }
    return resp
  }

  /**
  * Returns the rpcid, a strictly-increasing number, starting from 1, indicating the next
  * request ID that will be sent.
  */
  getRPCID = (): number => this.rpcid

  /**
  *
  * @param core Reference to the Avalanche instance using this endpoint
  * @param baseurl Path of the APIs baseurl - ex: "/ext/bc/avm"
  * @param jrpcVersion The jrpc version to use, default "2.0".
  */
  constructor(core: AvalancheCore, baseurl: string, jrpcVersion: string = "2.0") {
    super(core, baseurl)
    this.jrpcVersion = jrpcVersion
    this.rpcid = 1
  }
}
