import { Router } from "express";
import { prisma, isDatabaseConfigured } from "../../src/lib/prisma";
import { PRODUCTS } from "../../src/data/products";

export const productsRouter = Router();

// GET products with advanced filtering, search, and sorting
productsRouter.get("/", async (req, res) => {
  const {
    category,
    search,
    featured,
    specialOffer,
    inStock,
    brand,
    origin,
    minPrice,
    maxPrice,
    sortBy,
    limit,
    page,
  } = req.query;

  if (!isDatabaseConfigured) {
    let filtered = [...PRODUCTS];

    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (featured === "true") {
      filtered = filtered.filter((p) => p.isFeatured);
    }
    if (specialOffer === "true") {
      filtered = filtered.filter((p) => p.isSpecialOffer);
    }
    if (inStock === "true") {
      filtered = filtered.filter((p) => p.inStock);
    }
    if (brand && typeof brand === "string") {
      filtered = filtered.filter((p) =>
        p.brand.toLowerCase().includes(brand.toLowerCase()),
      );
    }
    if (origin && typeof origin === "string") {
      filtered = filtered.filter((p) =>
        p.origin?.toLowerCase().includes(origin.toLowerCase()),
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nameFa.toLowerCase().includes(q) ||
          p.nameEn?.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q),
      );
    }

    if (sortBy === "price_asc" || sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc" || sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating_desc" || sortBy === "rating-desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews_desc" || sortBy === "reviews-desc") {
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return res.json(filtered);
  }

  try {
    const whereClause: any = {};

    if (category && category !== "all") {
      whereClause.categoryId = String(category);
    }
    if (featured === "true") {
      whereClause.isFeatured = true;
    }
    if (specialOffer === "true") {
      whereClause.isSpecialOffer = true;
    }
    if (inStock === "true") {
      whereClause.inStock = true;
    }
    if (brand && typeof brand === "string") {
      whereClause.brand = { contains: brand, mode: "insensitive" };
    }
    if (origin && typeof origin === "string") {
      whereClause.origin = { contains: origin, mode: "insensitive" };
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = Number(minPrice);
      if (maxPrice) whereClause.price.lte = Number(maxPrice);
    }
    if (search && typeof search === "string" && search.trim() !== "") {
      const query = search.trim();
      whereClause.OR = [
        { nameFa: { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { specs: { contains: query, mode: "insensitive" } },
        { material: { contains: query, mode: "insensitive" } },
      ];
    }

    let orderByClause: any = { createdAt: "desc" };
    if (sortBy === "price_asc" || sortBy === "price-asc") {
      orderByClause = { price: "asc" };
    } else if (sortBy === "price_desc" || sortBy === "price-desc") {
      orderByClause = { price: "desc" };
    } else if (sortBy === "rating_desc" || sortBy === "rating-desc") {
      orderByClause = { rating: "desc" };
    } else if (sortBy === "reviews_desc" || sortBy === "reviews-desc") {
      orderByClause = { reviewsCount: "desc" };
    }

    const take = limit ? Number(limit) : undefined;
    const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;

    const [products] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: orderByClause,
        take,
        skip,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    if (products.length === 0 && (!category || category === "all") && !search) {
      return res.json(PRODUCTS);
    }

    const formatted = products.map((p) => {
      let galleryArray: string[] = [];
      if (p.gallery) {
        try {
          galleryArray =
            typeof p.gallery === "string" ? JSON.parse(p.gallery) : p.gallery;
        } catch {
          galleryArray = [p.image];
        }
      } else {
        galleryArray = [p.image];
      }

      const categoryString =
        p.categoryId ||
        (typeof p.category === "object" && p.category
          ? (p.category as any).id
          : p.category) ||
        "pots";

      return {
        ...p,
        category: categoryString,
        categoryId: categoryString,
        categoryInfo: typeof p.category === "object" ? p.category : null,
        gallery: galleryArray,
      };
    });

    res.json(formatted);
  } catch {
    res.json(PRODUCTS);
  }
});

// GET single product by ID with related products and reviews
productsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isDatabaseConfigured) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "محصول یافت نشد" });
    }
    const related = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id,
    ).slice(0, 4);
    return res.json({ product, related, reviews: [] });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      const local = PRODUCTS.find((p) => p.id === id);
      if (local) return res.json(local);
      return res.status(404).json({ error: "محصول یافت نشد" });
    }

    let galleryArray: string[] = [];
    if (product.gallery) {
      try {
        galleryArray = JSON.parse(product.gallery);
      } catch {
        galleryArray = [product.image];
      }
    } else {
      galleryArray = [product.image];
    }

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
    });

    const categoryString =
      product.categoryId ||
      (typeof product.category === "object" && product.category
        ? (product.category as any).id
        : product.category) ||
      "pots";

    res.json({
      ...product,
      category: categoryString,
      categoryId: categoryString,
      categoryInfo: product.category,
      gallery: galleryArray,
      related,
      reviews: product.reviews,
    });
  } catch {
    const local = PRODUCTS.find((p) => p.id === id);
    if (local) return res.json(local);
    res.status(404).json({ error: "محصول یافت نشد" });
  }
});

// POST create new product
productsRouter.post("/", async (req, res) => {
  try {
    const {
      id,
      nameFa,
      nameEn,
      brand,
      categoryId,
      price,
      originalPrice,
      rating,
      reviewsCount,
      badge,
      isSpecialOffer,
      isFeatured,
      inStock,
      material,
      origin,
      specs,
      description,
      image,
      gallery,
    } = req.body;

    if (!nameFa || !price || !categoryId) {
      return res
        .status(400)
        .json({ error: "نام محصول، قیمت و دسته‌بندی الزامی هستند" });
    }

    const generatedId =
      id ||
      (nameEn
        ? nameEn.toLowerCase().replace(/\s+/g, "-")
        : "prod-" + Date.now());

    const product = await prisma.product.create({
      data: {
        id: generatedId,
        nameFa,
        nameEn,
        brand: brand || "آشپزخانه مدرن",
        categoryId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        rating: rating ? Number(rating) : 5.0,
        reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
        badge,
        isSpecialOffer: Boolean(isSpecialOffer),
        isFeatured: Boolean(isFeatured),
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        material,
        origin,
        specs: specs || "",
        description: description || "",
        image,
        gallery: gallery
          ? typeof gallery === "string"
            ? gallery
            : JSON.stringify(gallery)
          : null,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice)
      updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.gallery && typeof updateData.gallery !== "string") {
      updateData.gallery = JSON.stringify(updateData.gallery);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
productsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "محصول با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
