campground = campgrounds.features;

let page = 2;
let isLoading = false;

const campgroundsContainer = document.getElementById("campgrounds-container");
const loadingIndicator = document.getElementById("loading-indicator");

loadMoreCampgrounds = () => {
	if (isLoading) return;
	isLoading = true;

	fetch(`/load-more?page=${page}`)
		.then((res) => res.json())
		.then((data) => {
			if (data.length > 0) {
				data.forEach((campground) => {
					const newCampgroundDiv = document.createElement("div");
					newCampgroundDiv.id = "camp-card";
					newCampgroundDiv.classList.add(
						"container",
						"mx-auto",
						"card",
						"shadow",
						"row",
						"flex-row",
						"mb-4",
						"py-3",
						"rounded-4",
						"gb-white",
						"justify-content-center"
					);

					newCampgroundDiv.innerHTML = `
                    <div class="col-lg-4 d-flex justify-content-center">
                    ${
											campground.images.length
												? `<img
                        crossorigin="anonymous"
                        class="mx-auto img-idx rounded-circle"
                        src="${campground.images[0].url}";
                        alt=""
                    />`
												: `<img
                    crossorigin="anonymous"
                    class="img-idx"
                    src="https://res.cloudinary.com/dxce9qhat/image/upload/v1689612983/YelpCamp/wsowzgvu4in3admhe1hg.jpg"
                    alt=""
                />`
										}
			
		</div>
		<div class="col-lg-8">
			<div class="card-body">
				<h3 class="card-title fw-bold">${campground.title}</h3>
				<p class="card-text fs-6 fw-bold">${campground.description}</p>
				<p class="card-text">
					<small class="text fw-bold">${campground.location}</small>
				</p>
				<a
					class="btn btn-primary camp-btn"
					href="/campgrounds/${campground._id}"
					>Visit ${campground.title}</a
				>
			</div>
		</div>
                    `;

					campgroundsContainer.appendChild(newCampgroundDiv);
				});
				page++;
			}
			isLoading = false;
			loadingIndicator.style.display = "none";
		});
};

window.addEventListener("scroll", () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 100) {
		loadingIndicator.style.display = "block";
		setTimeout(() => {
			loadMoreCampgrounds();
		}, 1500);
	}
});
