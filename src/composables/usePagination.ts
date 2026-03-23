import { ref, computed, watch } from 'vue';

export function usePagination<T>(
  items: () => T[],
  itemsPerPage: number,
  infinityPages: boolean = false
) {
  const currentPage = ref(1);

  const totalPages = computed(() => Math.ceil(items().length / itemsPerPage));

  const visibleItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    return items().slice(startIndex, startIndex + itemsPerPage);
  });

  const isPreviousPageBtnDisabled = computed(() => {
    if (totalPages.value < 2) return true;
    return infinityPages ? false : currentPage.value === 1;
  });

  const isNextPageBtnDisabled = computed(() => {
    if (totalPages.value < 2) return true;
    return infinityPages ? false : currentPage.value >= totalPages.value;
  });

  const setPreviousPage = () => {
    currentPage.value = currentPage.value === 1 ? totalPages.value : currentPage.value - 1;
  };

  const setNextPage = () => {
    currentPage.value = currentPage.value >= totalPages.value ? 1 : currentPage.value + 1;
  };

  const moveToItem = (index: number) => {
    if (index !== -1) {
      currentPage.value = Math.floor(index / itemsPerPage) + 1;
    }
  };

  watch(visibleItems, newItems => {
    if (!newItems.length && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
  });

  return {
    currentPage,
    totalPages,
    visibleItems,
    isPreviousPageBtnDisabled,
    isNextPageBtnDisabled,
    setPreviousPage,
    setNextPage,
    moveToItem,
  };
}
