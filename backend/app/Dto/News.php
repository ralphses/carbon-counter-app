<?php

namespace App\Dto;

class News
{
    /**
     * Create a new class instance.
     */

    private string $title;
    private string $description;
    private string $url;
    private string $image;
    private string $content;

    /**
     * @param string $title
     * @param string $description
     * @param string $url
     * @param string $image
     * @param string $content
     */
    public function __construct(string $title, string $description, string $url, string $image, string $content)
    {
        $this->title = $title;
        $this->description = $description;
        $this->url = $url;
        $this->image = $image;
        $this->content = $content;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @return string
     */
    public function getImage(): string
    {
        return $this->image;
    }

    /**
     * @return string
     */
    public function getContent(): string
    {
        return $this->content;
    }
}
