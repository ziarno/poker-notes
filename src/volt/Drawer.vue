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
import { computed, ref, useAttrs } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ DrawerProps {}
defineProps<Props>();

const attrs = useAttrs();

// `position` and the `update:visible` handler fall through as attrs (the Volt
// wrapper declares no real props), so read them here to drive swipe-to-close.
const position = computed(() => (attrs.position as string | undefined) ?? 'left');
const horizontal = computed(() => position.value === 'left' || position.value === 'right');
const draggable = computed(() =>
    ['left', 'right', 'top', 'bottom'].includes(position.value)
);
// Sign of the axis movement that dismisses the drawer (right/bottom close by
// moving in the positive direction, left/top by the negative).
const closeSign = computed(() =>
    position.value === 'right' || position.value === 'bottom' ? 1 : -1
);

const LOCK_THRESHOLD = 6; // px of movement before we commit to an axis
const CLOSE_RATIO = 0.4; // fraction of the panel size that triggers a close
const FLICK_VELOCITY = 0.5; // px/ms; a fast flick closes regardless of distance

let node: HTMLElement | null = null;
let startCoord = 0;
let startCross = 0;
let startTime = 0;
let size = 0;
let axisLock: 'none' | 'drag' | 'scroll' = 'none';

function offsetFor(delta: number) {
    // Only allow dragging toward the closing edge.
    return closeSign.value > 0 ? Math.max(0, delta) : Math.min(0, delta);
}

function setTransform(el: HTMLElement, offset: number) {
    el.style.transform = horizontal.value
        ? `translateX(${offset}px)`
        : `translateY(${offset}px)`;
}

function onPointerdown(e: PointerEvent) {
    if (!draggable.value) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    node = e.currentTarget as HTMLElement;
    node.style.transition = '';
    startCoord = horizontal.value ? e.clientX : e.clientY;
    startCross = horizontal.value ? e.clientY : e.clientX;
    startTime = e.timeStamp;
    axisLock = 'none';
}

function onPointermove(e: PointerEvent) {
    if (!node) return;
    const coord = horizontal.value ? e.clientX : e.clientY;
    const cross = horizontal.value ? e.clientY : e.clientX;
    const along = coord - startCoord;
    const perpendicular = cross - startCross;

    if (axisLock === 'none') {
        if (Math.max(Math.abs(along), Math.abs(perpendicular)) < LOCK_THRESHOLD) return;
        if (Math.abs(along) > Math.abs(perpendicular)) {
            axisLock = 'drag';
            size = horizontal.value ? node.offsetWidth : node.offsetHeight;
            node.setPointerCapture(e.pointerId);
        } else {
            // A scroll gesture along the cross axis — let the content scroll.
            axisLock = 'scroll';
            node = null;
            return;
        }
    }

    if (axisLock !== 'drag') return;
    e.preventDefault();
    setTransform(node, offsetFor(along));
}

function endDrag(e: PointerEvent) {
    const el = node;
    node = null;
    if (!el || axisLock !== 'drag') {
        axisLock = 'none';
        return;
    }
    axisLock = 'none';

    const coord = horizontal.value ? e.clientX : e.clientY;
    const offset = offsetFor(coord - startCoord);
    const distance = Math.abs(offset);
    const velocity = distance / Math.max(1, e.timeStamp - startTime);
    const shouldClose = distance > size * CLOSE_RATIO || velocity > FLICK_VELOCITY;

    if (shouldClose) closeWithAnimation(el);
    else snapBack(el);
}

function snapBack(el: HTMLElement) {
    el.style.transition = 'transform 200ms ease-out';
    el.style.transform = '';
    const clear = () => {
        el.style.transition = '';
        el.removeEventListener('transitionend', clear);
    };
    el.addEventListener('transitionend', clear);
}

function closeWithAnimation(el: HTMLElement) {
    // Animate the panel the rest of the way off-screen, then flip `visible` so
    // PrimeVue unmounts it. Our inline transition matches the leave transition's
    // duration, so the two stay in sync and `transitionend` drives the unmount.
    const target = horizontal.value
        ? `translateX(${closeSign.value * 100}%)`
        : `translateY(${closeSign.value * 100}%)`;
    el.style.transition = 'transform 200ms ease-in';
    el.style.transform = target;
    (attrs['onUpdate:visible'] as ((value: boolean) => void) | undefined)?.(false);
}

const theme = ref<DrawerPassThroughOptions>({
    root: {
        class: `flex flex-col pointer-events-auto relative
        border-surface-200 dark:border-surface-700
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0
        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]
        p-left:w-80 p-left:h-full p-left:border-r p-left:touch-pan-y
        p-right:w-80 p-right:h-full p-right:border-s p-right:touch-pan-y
        p-top:h-40 p-top:w-full p-top:border-b p-top:touch-pan-x
        p-bottom:h-40 p-bottom:w-full p-bottom:border-t p-bottom:touch-pan-x
        p-full-screen:transition-opacity p-full-screen:transform-none p-full-screen:w-screen p-full-screen:h-screen p-full-screen:max-h-full p-full-screen:top-0 p-full-screen:left-0`,
        onPointerdown,
        onPointermove,
        onPointerup: endDrag,
        onPointercancel: endDrag
    } as DrawerPassThroughOptions['root'],
    header: `flex items-center justify-between flex-shrink-0 p-5`,
    title: `font-semibold text-2xl`,
    content: `overflow-y-auto flex-grow pt-0 pb-5 px-5`,
    footer: `p-5`,
    mask: `p-modal:bg-black/50`,
    transition: {
        enterFromClass: `p-left:-translate-x-full p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full p-full-screen:opacity-0`,
        enterActiveClass: `transition-transform duration-400 ease-out p-full-screen:transition-opacity`,
        leaveActiveClass: `transition-transform duration-200 ease-in p-full-screen:transition-opacity`,
        leaveToClass: `p-left:-translate-x-full p-right:translate-x-full p-top:-translate-y-full p-bottom:translate-y-full p-full-screen:opacity-0`
    }
});
</script>
