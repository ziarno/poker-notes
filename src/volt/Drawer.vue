<template>
    <Drawer
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #closebutton="{ closeCallback }">
            <SecondaryButton variant="text" rounded @click="closeCallback" autofocus>
                <template #icon>
                    <TimesIcon />
                </template>
            </SecondaryButton>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Drawer>
</template>

<script setup lang="ts">
import TimesIcon from '@primevue/icons/times';
import Drawer, { type DrawerPassThroughOptions, type DrawerProps } from 'primevue/drawer';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ DrawerProps {}
defineProps<Props>();

const theme = ref<DrawerPassThroughOptions>({
    root: `h-full flex flex-col
        border-surface-200 dark:border-surface-700
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0 shadow-xl
        p-left:border-r p-right:border-l p-top:border-b p-bottom:border-t
        p-left:rounded-r-xl p-right:rounded-l-xl p-top:rounded-b-xl p-bottom:rounded-t-xl
        p-full:rounded-none p-full:w-screen p-full:h-screen`,
    header: `flex items-center justify-between shrink-0 p-5`,
    title: `font-semibold text-xl`,
    content: `overflow-y-auto grow px-5 pb-5`,
    footer: `shrink-0 pt-0 px-5 pb-5`,
    mask: `bg-black/50 fixed top-0 start-0 w-full h-full`,
    transition: {
        enterFromClass: 'translate-x-full p-left:-translate-x-full p-left:translate-x-0 p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full opacity-0',
        enterActiveClass: 'transition-all duration-300 ease-out',
        leaveActiveClass: 'transition-all duration-300 ease-out',
        leaveToClass: 'translate-x-full p-left:-translate-x-full p-left:translate-x-0 p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full opacity-0'
    }
});
</script>
