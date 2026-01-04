/// <reference types="vite/client" />
/// <reference types="@types/meteor" />

// Vue SFC module declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Meteor package module declarations
declare module 'meteor/meteor' {
  export * from '@types/meteor/meteor'
}

declare module 'meteor/mongo' {
  export * from '@types/meteor/mongo'
}

// vue-meteor-tracker module enhancement
declare module 'vue-meteor-tracker' {
  import { Meteor } from 'meteor/meteor'
  import { App, ComputedRef } from 'vue'

  export interface AutorunEffect<TResult> {
    result: ComputedRef<TResult>
    stop: () => void
  }

  export interface ReactiveMeteorSubscription {
    ready: ComputedRef<boolean>
    sub: Meteor.SubscriptionHandle
    stop: () => void
  }

  export function autorun<TResult = unknown>(
    callback: () => TResult
  ): AutorunEffect<TResult>

  export function subscribe(
    payload: string | (() => [name: string, ...args: any[]] | false),
    ...args: any[]
  ): ReactiveMeteorSubscription

  export const VueMeteor: {
    install(app: App): void
  }
}
