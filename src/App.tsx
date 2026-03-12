import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Copy, ExternalLink, Github, Monitor } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

// Types for metadata.json
interface WidgetMetadata {
  publisher: string
  "widget-name": string
  description: string
}

interface WidgetData {
  id: string
  metadata: WidgetMetadata
  html: string
  thumbnailUrl: string
}

// Use Vite's import.meta.glob to load all widget files at build time
const metadataModules = import.meta.glob<{ default: WidgetMetadata }>('/widgets/*/metadata.json', { eager: true });
const htmlModules = import.meta.glob<string>('/widgets/*/widget.html', { query: '?raw', import: 'default', eager: true });
const thumbnailModules = import.meta.glob<string>('/widgets/*/thumbnail.png', { query: '?url', import: 'default', eager: true });

export function App() {
  const [search, setSearch] = useState("")
  
  // Transform the glob imports into a usable array
  const widgets: WidgetData[] = useMemo(() => {
    return Object.keys(metadataModules).map((metaPath) => {
      const folderPath = metaPath.replace('/metadata.json', '');
      const widgetId = folderPath.split('/').pop() || '';
      
      return {
        id: widgetId,
        metadata: metadataModules[metaPath].default,
        html: htmlModules[`${folderPath}/widget.html`] || '',
        thumbnailUrl: thumbnailModules[`${folderPath}/thumbnail.png`] || '',
      };
    });
  }, []);

  const filteredWidgets = widgets.filter(w => 
    w.metadata["widget-name"].toLowerCase().includes(search.toLowerCase()) || 
    w.metadata.description.toLowerCase().includes(search.toLowerCase()) ||
    w.metadata.publisher.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopyCode = async (html: string) => {
    try {
      await navigator.clipboard.writeText(html)
      alert("HTML code copied to clipboard!")
    } catch (err) {
      console.error("Error copying code:", err)
    }
  }

  const handlePreviewFull = (html: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Xeneon Edge Marketplace</h1>
              <p className="text-xs text-muted-foreground">Community Widgets for Corsair Xeneon Edge</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search widgets..."
                className="w-64 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <ModeToggle />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Widget
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>How to Submit</DialogTitle>
                  <DialogDescription>
                    We use a PR-based submission process via GitHub.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                  <p>1. Create a folder for your widget in <code>widgets/</code> (e.g., <code>widgets/clock/</code>)</p>
                  <p>2. Your folder must contain exactly 3 files:</p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li><code>widget.html</code>: Your standalone web app.</li>
                    <li><code>thumbnail.png</code>: A screenshot of your widget.</li>
                    <li><code>metadata.json</code>: Widget information.</li>
                  </ul>
                  <div className="rounded-md bg-muted p-4 font-mono text-xs">
                    <pre>
{`{
  "publisher": "Your Name",
  "widget-name": "Widget Title",
  "description": "Short description"
}`}
                    </pre>
                  </div>
                  <p>3. Submit a Pull Request to our repository!</p>
                </div>
                <Button asChild>
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Open Repository
                  </a>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 p-4 md:p-8">
        {/* Mobile Search */}
        <div className="mb-6 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search widgets..."
              className="w-full pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWidgets.map((widget) => (
            <Card key={widget.id} className="group flex flex-col overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="aspect-video relative overflow-hidden border-b bg-muted">
                {/* Static Thumbnail (Priority) */}
                {widget.thumbnailUrl ? (
                  <img 
                    src={widget.thumbnailUrl} 
                    alt={widget.metadata["widget-name"]}
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground transition-opacity duration-300 group-hover:opacity-0">
                    <Monitor className="h-8 w-8 opacity-20" />
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">Hover to preview</span>
                  </div>
                )}

                {/* Live Preview (Only on Hover for performance/security) */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <iframe 
                    srcDoc={widget.html} 
                    sandbox="allow-scripts"
                    loading="lazy"
                    className="h-full w-full pointer-events-none scale-50 origin-top-left border-0" 
                    style={{ width: '200%', height: '200%' }}
                    title={widget.metadata["widget-name"]}
                  />
                </div>
                <div className="absolute inset-0 bg-transparent" />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg">{widget.metadata["widget-name"]}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 h-10 text-xs">
                  {widget.metadata.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-4 pt-0">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                    {widget.metadata.publisher.charAt(0).toUpperCase()}
                  </div>
                  <span>By {widget.metadata.publisher}</span>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => handleCopyCode(widget.html)}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => handlePreviewFull(widget.html)}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Full Preview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredWidgets.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <Monitor className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium">No widgets found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or submit the first one!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Corsair Xeneon Edge Widget Marketplace
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="flex items-center gap-1 hover:text-foreground">
              <Github className="h-4 w-4" />
              <span className="text-xs">GitHub Repo</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
