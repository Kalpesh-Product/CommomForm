import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios"; // your custom axios instance
import { IoChevronDown } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import humanDate from "../utils/humanDate";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const DESTS = [
  { label: "All", country: null, keyword: null, lang: null }, // ✅ New option
  // { label: "Goa", country: "in", keyword: "goa", lang: "en" },
  // { label: "Bali", country: "id", keyword: "bali", lang: "en" },
  // { label: "Bangkok", country: "th", keyword: "bangkok", lang: "en" },
  // { label: "Phuket", country: "th", keyword: "phuket", lang: "en" },
  // { label: "Ho Chi Minh", country: "vn", keyword: "ho chi minh", lang: "en" },
  // { label: "Rio", country: "br", keyword: "rio", lang: "en" },
  { label: "Abu Dhabi", country: "uae", keyword: "abudhabi", lang: "en" },
  { label: "Dubai", country: "uae", keyword: "dubai", lang: "en" },
  { label: "Sarjah", country: "uae", keyword: "sharjah", lang: "en" },
];

const stripHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const extractImageFromContent = (content) => {
  const match = content?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};

const BlogCard = ({ b }) => {
  const fallbackImg = extractImageFromContent(b.content || b.description);
  const thumbnail = b.mainImage || fallbackImg;
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate("blog-details", { state: { content: b } })}
      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={b.mainTitle}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100" />
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{b.mainTitle}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {b.mainContent}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">{b.author || "Author"}</span>
          <time dateTime={b.date}>{b.date ? humanDate(b.date) : ""}</time>
        </div>

        {/* <NavLink
          to={"blog-details"}
          className={"underline"}
      
        >
          Read full blog →
        </NavLink> */}

        {/* <a
          href={b.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-blue-600 font-medium hover:underline">
          Read full blog →
        </a> */}
      </div>
    </article>
  );
};

const BlogFetch = () => {
  // const [dest, setDest] = useState(DESTS[0]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDest =
    DESTS.find((d) => d.label === searchParams.get("dest")) || DESTS[0];
  const [dest, setDest] = useState(DESTS[0]);
  const formData = useSelector((state) => state.location.formValues);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1) Priority: URL (?dest=...)
    const urlDestLabel = searchParams.get("dest");
    if (urlDestLabel) {
      const foundByLabel = DESTS.find((d) => d.label === urlDestLabel);
      if (foundByLabel) {
        setDest(foundByLabel);
        return;
      } else {
        // URL has an unknown destination -> keep original behavior (null + clear)
        setDest(null);
        setSearchParams({});
        return;
      }
    }

    // 2) Fallback: Redux (formData.location uses keyword)
    const selectedDest = formData?.location;
    if (selectedDest) {
      const foundByKeyword = DESTS.find((d) => d.keyword === selectedDest);
      if (foundByKeyword) {
        setDest(foundByKeyword);
        setSearchParams({ dest: foundByKeyword.label });
        return;
      } else {
        // No matching destination -> original behavior
        setDest(null);
        setSearchParams({});
        return;
      }
    }

    // 3) No location in Redux -> original behavior
    setDest(null);
    setSearchParams({});
  }, [formData, searchParams, setSearchParams]);

  const handleChange = (val) => {
    const selected = DESTS.find((d) => d.label === val);
    setDest(selected);
    setSearchParams({ dest: selected.label });
  };

  const params = useMemo(() => {
    if (!dest || dest.label === "All") return null;
    return {
      country: dest.country,
      keyword: dest.keyword,
      lang: dest.lang,
      category: "general",
      max: 10,
    };
  }, [dest]);

  // const { data, isPending, isError, refetch, isFetching } = useQuery({
  //   queryKey: ["blogs", dest.keyword],
  //   queryFn: async () => {
  //     const res = await axios.get("/blogs/get-blogs", { params });
  //     return res.data;
  //   },
  // });

  // const { data, isPending, isError } = useQuery({
  //   queryKey: ["blogs", dest?.label], // optional chaining
  //   queryFn: async () => {
  //     if (!dest) return []; // early return if dest is null
  //     if (dest.label === "All") {
  //       const res = await axios.get("/blogs/get-blogs");
  //       return res.data;
  //     }
  //     const res = await axios.get("/blogs/get-blogs", { params });
  //     return res.data;
  //   },
  //   refetchOnWindowFocus: false,
  // });

  // //   const blogs = Array.isArray(data?.articles) ? data.articles : [];
  // const blogs = Array.isArray(data) ? data : [];

  const hardcodedBlogs = [
    {
      guid: "hardcoded-1",
      mainTitle: "A Quick Guide to Goa’s Best Beaches",
      mainContent:
        "Explore North and South Goa with this quick guide to the best beach spots, sunsets, and cafes.",
      author: "CommonForm",
      date: "2024-06-10",
      mainImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Goa is packed with beautiful beaches. From the lively shores of Baga to the calmer sands of Palolem, there is something for every traveler.</p>",
    },
    {
      guid: "hardcoded-2",
      mainTitle: "Bangkok Street Food: Must-Try Dishes",
      mainContent:
        "From pad thai to mango sticky rice, here’s what to eat on your first visit to Bangkok.",
      author: "CommonForm",
      date: "2024-05-22",
      mainImage:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Bangkok’s street food scene is unbeatable. Start with pad thai, then work your way through spicy papaya salad and freshly grilled skewers.</p>",
    },
    {
      guid: "hardcoded-3",
      mainTitle: "Weekend Escape: Bali Itinerary",
      mainContent:
        "A simple 2-day plan covering Ubud, Seminyak, and the best sunset views.",
      author: "CommonForm",
      date: "2024-04-15",
      mainImage:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Day one: Ubud’s rice terraces and coffee plantations. Day two: Seminyak shopping and sunset beach bars.</p>",
    },
    {
      guid: "hardcoded-1",
      mainTitle: "A Quick Guide to Goa’s Best Beaches",
      mainContent:
        "Explore North and South Goa with this quick guide to the best beach spots, sunsets, and cafes.",
      author: "CommonForm",
      date: "2024-06-10",
      mainImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Goa is packed with beautiful beaches. From the lively shores of Baga to the calmer sands of Palolem, there is something for every traveler.</p>",
    },
    {
      guid: "hardcoded-2",
      mainTitle: "Bangkok Street Food: Must-Try Dishes",
      mainContent:
        "From pad thai to mango sticky rice, here’s what to eat on your first visit to Bangkok.",
      author: "CommonForm",
      date: "2024-05-22",
      mainImage:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Bangkok’s street food scene is unbeatable. Start with pad thai, then work your way through spicy papaya salad and freshly grilled skewers.</p>",
    },
    {
      guid: "hardcoded-3",
      mainTitle: "Weekend Escape: Bali Itinerary",
      mainContent:
        "A simple 2-day plan covering Ubud, Seminyak, and the best sunset views.",
      author: "CommonForm",
      date: "2024-04-15",
      mainImage:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Day one: Ubud’s rice terraces and coffee plantations. Day two: Seminyak shopping and sunset beach bars.</p>",
    },
    {
      guid: "hardcoded-1",
      mainTitle: "A Quick Guide to Goa’s Best Beaches",
      mainContent:
        "Explore North and South Goa with this quick guide to the best beach spots, sunsets, and cafes.",
      author: "CommonForm",
      date: "2024-06-10",
      mainImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Goa is packed with beautiful beaches. From the lively shores of Baga to the calmer sands of Palolem, there is something for every traveler.</p>",
    },
    {
      guid: "hardcoded-2",
      mainTitle: "Bangkok Street Food: Must-Try Dishes",
      mainContent:
        "From pad thai to mango sticky rice, here’s what to eat on your first visit to Bangkok.",
      author: "CommonForm",
      date: "2024-05-22",
      mainImage:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Bangkok’s street food scene is unbeatable. Start with pad thai, then work your way through spicy papaya salad and freshly grilled skewers.</p>",
    },
    {
      guid: "hardcoded-3",
      mainTitle: "Weekend Escape: Bali Itinerary",
      mainContent:
        "A simple 2-day plan covering Ubud, Seminyak, and the best sunset views.",
      author: "CommonForm",
      date: "2024-04-15",
      mainImage:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Day one: Ubud’s rice terraces and coffee plantations. Day two: Seminyak shopping and sunset beach bars.</p>",
    },
    {
      guid: "hardcoded-1",
      mainTitle: "A Quick Guide to Goa’s Best Beaches",
      mainContent:
        "Explore North and South Goa with this quick guide to the best beach spots, sunsets, and cafes.",
      author: "CommonForm",
      date: "2024-06-10",
      mainImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Goa is packed with beautiful beaches. From the lively shores of Baga to the calmer sands of Palolem, there is something for every traveler.</p>",
    },
    {
      guid: "hardcoded-2",
      mainTitle: "Bangkok Street Food: Must-Try Dishes",
      mainContent:
        "From pad thai to mango sticky rice, here’s what to eat on your first visit to Bangkok.",
      author: "CommonForm",
      date: "2024-05-22",
      mainImage:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Bangkok’s street food scene is unbeatable. Start with pad thai, then work your way through spicy papaya salad and freshly grilled skewers.</p>",
    },
    {
      guid: "hardcoded-3",
      mainTitle: "Weekend Escape: Bali Itinerary",
      mainContent:
        "A simple 2-day plan covering Ubud, Seminyak, and the best sunset views.",
      author: "CommonForm",
      date: "2024-04-15",
      mainImage:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Day one: Ubud’s rice terraces and coffee plantations. Day two: Seminyak shopping and sunset beach bars.</p>",
    },
  ];

  // ✅ Toggle data source by commenting/uncommenting the blocks below.

  // ✅ API blogs (uncomment to use the API)
  // const { data, isPending, isError } = useQuery({
  //   queryKey: ["blogs", dest?.label], // optional chaining
  //   queryFn: async () => {
  //     if (!dest) return []; // early return if dest is null
  //     if (dest.label === "All") {
  //       const res = await axios.get("/blogs/get-blogs");
  //       return res.data;
  //     }
  //     const res = await axios.get("/blogs/get-blogs", { params });
  //     return res.data;
  //   },
  //   refetchOnWindowFocus: false,
  // });
  // const blogs = Array.isArray(data) ? data : [];

  // ✅ Hardcoded blogs (comment out to use the API)
  const blogs = hardcodedBlogs;
  const isPending = false;
  const isError = false;

  if (!dest) {
    return (
      <div className="my-6">
        <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
          <h2 className="text-title font-semibold text-host">Blog</h2>

          {/* Controls */}
          <div className="flex items-center justify-end gap-3 mb-5">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <FormControl variant="standard" sx={{ minWidth: 140 }}>
              {/* <InputLabel>Destination</InputLabel> */}
              <Select
                value={""}
                onChange={(e) => handleChange(e.target.value)}
                label="Location"
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                {DESTS.map((d) => (
                  <MenuItem key={d.label} value={d.label}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="text-subtitle text-gray-600 my-36">
          No blog posts available for this location. You can use the filter to
          check blogs of other locations.
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
        <h2 className="text-title font-semibold text-host">Blog</h2>
        {/* Controls */}
        <div className="flex items-center justify-end gap-3 mb-5">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <FormControl variant="standard" sx={{ minWidth: 140 }}>
            {/* <InputLabel>Destination</InputLabel> */}
            <Select
              value={dest.label}
              onChange={(e) => handleChange(e.target.value)}
              label="Location"
            >
              {DESTS.map((d) => (
                <MenuItem key={d.label} value={d.label}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <button
            type="button"
            onClick={() => refetch()}
            className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
            disabled={isFetching}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </button> */}

          {/* {isPending && <span className="text-sm text-gray-500">Loading…</span>}
          {isError && (
            <span className="text-sm text-red-600">Could not load blogs.</span>
          )} */}
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {isPending && (
          <div className="h-screen">
            <span className="text-sm text-gray-500">Loading…</span>
          </div>
        )}
        {isError && (
          <div className="h-screen">
            <span className="text-sm text-red-600">Could not load blogs.</span>
          </div>
        )}
        {blogs.map((b) => (
          <BlogCard key={b.guid} b={b} />
        ))}
      </div>

      {!isPending && !isError && blogs.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No blog posts found.</p>
      )}
    </div>
  );
};

export default BlogFetch;
