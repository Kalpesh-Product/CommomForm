// src/components/NewsFetch.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios.js";
import { IoChevronDown } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
import humanDate from "../utils/humanDate.js";
import { useSelector } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PaginatedGrid from "./PaginatedGrid.jsx";

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

const extractImageFromContent = (content) => {
  const match = content?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};

const NewsCard = ({ a }) => {
  const navigate = useNavigate();

  const fallbackImg = extractImageFromContent(a.content || a.description);
  const thumbnail = a.mainImage || fallbackImg;

  return (
    <article
      onClick={() => navigate("news-details", { state: { content: a } })}
      className="group relative rounded-xl border bg-white transition hover:shadow-md cursor-pointer overflow-hidden max-w-full"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        {/* <div className="sm:w-56 shrink-0 block"> */}
        <div className="w-full sm:w-56 shrink-0 block">
          <div className="h-40 sm:h-36 rounded-lg overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={a.mainTitle}
                className="block h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="mt-1 text-lg font-semibold leading-snug text-gray-900 line-clamp-2">
            {a.mainTitle}
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {a.mainContent}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">{a.author || "News Desk"}</span>
            <time dateTime={a.date}>{a.date ? humanDate(a.date) : ""}</time>
          </div>
        </div>
      </div>
    </article>
  );
};

const NewsFetch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dest, setDest] = useState(DESTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const formData = useSelector((state) => state.location.formValues);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1️⃣ Priority: URL (?dest=...)
    const urlDestLabel = searchParams.get("dest");
    if (urlDestLabel) {
      const foundByLabel = DESTS.find((d) => d.label === urlDestLabel);
      if (foundByLabel) {
        setDest(foundByLabel);
        return;
      } else {
        // 🚫 Unknown destination in URL → original behavior
        setDest(null);
        setSearchParams({});
        return;
      }
    }

    // 2️⃣ Fallback: Redux (keyword-based)
    const selectedDest = formData?.location;
    if (selectedDest) {
      const foundByKeyword = DESTS.find((d) => d.keyword === selectedDest);
      if (foundByKeyword) {
        setDest(foundByKeyword);
        setSearchParams({ dest: foundByKeyword.label });
        return;
      } else {
        // 🚫 No matching destination → original behavior
        setDest(null);
        setSearchParams({});
        return;
      }
    }

    // 3️⃣ No destination at all → original behavior
    setDest(null);
    setSearchParams({});
  }, [formData, searchParams, setSearchParams]);

  const handleChange = (val) => {
    const selected = DESTS.find((d) => d.label === val);
    if (selected) {
      setDest(selected);
      setSearchParams({ dest: selected.label });
    }
  };

  const params = useMemo(() => {
    if (!dest || dest.label === "All") return null; // add !dest check
    return {
      country: dest.country,
      keyword: dest.keyword,
      lang: dest.lang,
      category: "general",
      max: 10,
    };
  }, [dest]);

  const hardcodedArticles = [
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
    {
      guid: "news-hardcoded-1",
      mainTitle: "Goa Tourism Sees Early Monsoon Rush",
      mainContent:
        "Hotels report higher-than-usual weekend bookings as travelers arrive ahead of the rains.",
      author: "CommonForm News",
      date: "2024-06-12",
      mainImage:
        "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Tourism officials noted a spike in early monsoon travel, with beachside stays seeing strong demand.</p>",
    },
    {
      guid: "news-hardcoded-2",
      mainTitle: "Bangkok Opens New Night Market Hub",
      mainContent:
        "A new riverside night market features local food stalls, music, and artisan pop-ups.",
      author: "CommonForm News",
      date: "2024-05-28",
      mainImage:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>City planners say the market will support small businesses while giving visitors a new evening destination.</p>",
    },
    {
      guid: "news-hardcoded-3",
      mainTitle: "Bali Launches Sustainable Travel Guide",
      mainContent:
        "The new guide highlights eco-friendly stays, local tours, and conservation programs.",
      author: "CommonForm News",
      date: "2024-04-19",
      mainImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      content:
        "<p>Officials hope the guide encourages mindful tourism while supporting local communities.</p>",
    },
  ];

  // ✅ Toggle data source by commenting/uncommenting the blocks below.

  // ✅ API news (uncomment to use the API)
  // const { data, isPending, isError } = useQuery({
  //   queryKey: ["gnews", dest?.label], // use optional chaining
  //   queryFn: async () => {
  //     if (!dest) return []; // early return if dest is null
  //     if (dest.label === "All") {
  //       const res = await axios.get("/news/get-news");
  //       return res.data;
  //     }
  //     const res = await axios.get("/news/get-news", { params });
  //     return res.data;
  //   },
  //   refetchOnWindowFocus: false,
  // });
  // const articles = Array.isArray(data) ? data : [];

  // ✅ Hardcoded news (comment out to use the API)
  const articles = hardcodedArticles;
  const isPending = false;
  const isError = false;

  const suggestionOptions = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    const uniqueTitles = [
      ...new Set(
        articles
          .map((item) => item?.mainTitle)
          .filter(Boolean)
          .map((title) => title.trim())
          .filter((title) => title.length > 0),
      ),
    ];
    return uniqueTitles.map((title) => ({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      label: title,
    }));
  }, [articles]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestionOptions;
    const normalized = searchQuery.toLowerCase();
    return suggestionOptions.filter((suggestion) =>
      suggestion.label.toLowerCase().includes(normalized),
    );
  }, [searchQuery, suggestionOptions]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return articles;
    return articles.filter((item) =>
      item?.mainTitle?.toLowerCase().includes(normalizedQuery),
    );
  }, [articles, searchQuery]);

  // const { data, isPending, isError } = useQuery({
  //   queryKey: ["gnews", dest?.label], // use optional chaining
  //   queryFn: async () => {
  //     if (!dest) return []; // early return if dest is null
  //     if (dest.label === "All") {
  //       const res = await axios.get("/news/get-news");
  //       return res.data;
  //     }
  //     const res = await axios.get("/news/get-news", { params });
  //     return res.data;
  //   },
  //   refetchOnWindowFocus: false,
  // });

  // const articles = Array.isArray(data) ? data : [];

  if (!dest) {
    return (
      <div className="my-6">
        <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
          <h2 className="text-title font-semibold text-host">News</h2>
          {/* Controls (keep dropdown usable) */}
          <div className="flex items-center justify-end gap-3 mb-0 ">
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
          No news available for this location. You can use the filter to check
          news of other locations.
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
        <h2 className="text-title font-semibold text-host">News</h2>
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-0 ">
          <div className="w-full sm:w-auto max-w-xs">
            <div className="relative">
              <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="search"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSuggestionsOpen(true)}
                onBlur={() =>
                  setTimeout(() => setIsSuggestionsOpen(false), 120)
                }
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
              />
              {isSuggestionsOpen && searchQuery && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <ul className="max-h-60 overflow-auto py-2 text-sm">
                    {filteredSuggestions.length === 0 ? (
                      <li className="px-4 py-2 text-slate-500">
                        No matches found.
                      </li>
                    ) : (
                      filteredSuggestions.map((suggestion) => (
                        <li key={suggestion.id}>
                          <button
                            type="button"
                            onMouseDown={() => setSearchQuery(suggestion.label)}
                            className="flex w-full items-start gap-2 px-4 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-blue/10 text-xs font-semibold text-primary-blue">
                              {suggestion.label.charAt(0)}
                            </span>
                            <span className="font-medium">
                              {suggestion.label}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
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
        </div>
      </div>

      {/* Results */}
      {isPending && (
        <div className="h-screen">
          <span className="text-sm text-gray-500">Loading…</span>
        </div>
      )}
      {isError && (
        <div className="h-screen">
          <span className="text-sm text-red-600">Could not load news.</span>
        </div>
      )}
      {!isPending && !isError && filteredArticles.length > 0 && (
        <PaginatedGrid
          data={filteredArticles}
          entriesPerPage={12}
          columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
          renderItem={(article) => <NewsCard key={article.guid} a={article} />}
        />
      )}

      {!isPending && !isError && filteredArticles.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No articles found.</p>
      )}
    </div>
  );
};

export default NewsFetch;
