/**
 * @file Content Filter
 * @author Shaun Callaghan
 * @version 0.1
 */

/**
 * Filter Setup
 *
 * @param filter - the dom element of the filter nav
 * filterOptions - array of all filter dom element options
 * allItems - array of all items to be filtered - elements with 'filter-item' class
 *
 * adds onClick function to each filter option to display filtered results
 */
function filterSetup(filter) {
  const filterOptions = [].slice.call(
    filter.getElementsByClassName("filter--option")
  );
  const allItems = [].slice.call(
    filter.parentElement.getElementsByClassName("filter-item")
  );
  let filterValue;

  filterOptions.forEach(function(option) {
    option.addEventListener("click", function(event) {
      event.preventDefault();
      removeActive(filterOptions);
      option.classList.add("active");
      filterValue = option.getAttribute("data-filter");
      displayItems(filterValue, allItems);
    });
  });
}

/**
 * Display Items
 *
 * @param filterValue - selected filter option as string
 * @param allItems - array of all items with 'filter-item' class
 *
 * filteredItems - all items filtered down to selected filter
 * hiddenItems - all items currently hidden
 *
 * when function runs, all items are hidden, then filtered items are faded in
 *
 * TODO: do not hide ALL items if said items are in next batch of filtered items
 */

function displayItems(filterValue, allItems) {
  let filteredItems = allItems.filter(function(image) {
    return image.getAttribute("data-filter") === filterValue;
  });
  let hiddenItems = allItems.filter(function(image) {
    return image.classList.contains("hidden");
  });

  allItems.forEach(function(image) {
    image.classList.add("hidden");
  });

  if (filterValue === "all") {
    hiddenItems.forEach(function(image) {
      fade(image, "in", 500);
    });
  } else {
    filteredItems.forEach(function(image) {
      fade(image, "in", 500);
    });
  }
}

/**
 *	Remove Active
 *
 * removes active state from filter options
 *
 */
function removeActive(options) {
  options.forEach(function(option) {
    option.classList.remove("active");
  });
}
